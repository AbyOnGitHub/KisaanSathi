"""
Market price service for fetching and caching Indian government Mandi prices via data.gov.in.
Includes resilient error handling, automatic cache invalidation (24h), and price comparison logic.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
import httpx
from app.config import settings
from app.database import get_supabase

# Government Data.gov.in Mandi API URL
DATA_GOV_API_ENDPOINT = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

# List of default agricultural commodities for marketplace sync
DEFAULT_COMMODITIES = [
    "Wheat", "Rice", "Maize", "Cotton", "Soyabean", "Mustard", "Potato", "Onion", "Tomato", "Gram"
]


class MarketPriceService:
    """Service for querying and synchronizing Mandi market prices."""

    @staticmethod
    def _is_cache_stale(fetched_at_str: Optional[str]) -> bool:
        """Checks if a cached price entry is older than 24 hours."""
        if not fetched_at_str:
            return True
        try:
            # Handle ISO string with timezone
            if fetched_at_str.endswith("Z"):
                fetched_at = datetime.fromisoformat(fetched_at_str.replace("Z", "+00:00"))
            else:
                fetched_at = datetime.fromisoformat(fetched_at_str)
            now = datetime.now(timezone.utc)
            return (now - fetched_at) > timedelta(hours=24)
        except Exception:
            return True

    @classmethod
    async def fetch_from_data_gov(
        cls,
        commodity: str,
        state: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Calls data.gov.in Mandi API to fetch live commodity prices.
        Gracefully returns an empty list if external API fails or key is missing.
        """
        api_key = settings.DATA_GOV_API_KEY
        if not api_key:
            # If no API key configured, safely return empty list without failing
            return []

        params = {
            "api-key": api_key,
            "format": "json",
            "filters[commodity]": commodity,
            "limit": 5,
            "sort[arrival_date]": "desc"
        }
        if state:
            params["filters[state]"] = state

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(DATA_GOV_API_ENDPOINT, params=params)
                if response.status_code == 200:
                    data = response.json()
                    records = data.get("records", [])
                    return records
                return []
        except Exception as e:
            # Resilient fallback: log error and return empty list
            print(f"Warning: data.gov.in API request failed: {e}")
            return []

    @classmethod
    async def get_market_prices(
        cls,
        commodity: str,
        state: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieves market prices for a commodity from database cache.
        If cache is missing or stale (>24h), fetches fresh data from data.gov.in.
        Returns graceful response if no data is available.
        """
        supabase = get_supabase()
        
        # 1. Check local Supabase cache first
        try:
            query = supabase.table("market_prices").select("*").ilike("commodity", f"%{commodity}%")
            if state:
                query = query.ilike("state", f"%{state}%")
            
            cached_res = query.order("arrival_date", desc=True).limit(5).execute()
            cached_items = cached_res.data or []

            # Check if cache exists and is fresh (<24h)
            if cached_items and not cls._is_cache_stale(cached_items[0].get("fetched_at")):
                return {
                    "data": cached_items,
                    "message": "Loaded from active market price cache",
                    "commodity": commodity,
                    "state": state
                }
        except Exception as e:
            print(f"Notice: Cache query error: {e}")
            cached_items = []

        # 2. Cache is missing or stale -> Try refreshing from data.gov.in
        fresh_records = await cls.fetch_from_data_gov(commodity, state)
        
        if fresh_records:
            now_iso = datetime.now(timezone.utc).isoformat()
            saved_items = []
            for rec in fresh_records:
                try:
                    price_entry = {
                        "commodity": rec.get("commodity", commodity),
                        "variety": rec.get("variety", "Standard"),
                        "state": rec.get("state", state or "All"),
                        "district": rec.get("district", "Unknown"),
                        "market_name": rec.get("market", "Mandi"),
                        "min_price": float(rec.get("min_price") or 0.0),
                        "max_price": float(rec.get("max_price") or 0.0),
                        "modal_price": float(rec.get("modal_price") or 0.0),
                        "arrival_date": rec.get("arrival_date"),
                        "fetched_at": now_iso
                    }
                    insert_res = supabase.table("market_prices").insert(price_entry).execute()
                    if insert_res.data:
                        saved_items.append(insert_res.data[0])
                except Exception as ex:
                    print(f"Notice: Failed to insert market price row: {ex}")

            if saved_items:
                return {
                    "data": saved_items,
                    "message": "Refreshed from data.gov.in API",
                    "commodity": commodity,
                    "state": state
                }

        # 3. Fallback: If live API yielded nothing, return stale cached items if any existed
        if cached_items:
            return {
                "data": cached_items,
                "message": "Market data loaded from existing cache (live refresh unavailable)",
                "commodity": commodity,
                "state": state
            }

        # 4. Resilient friendly response when no data exists anywhere
        return {
            "data": None,
            "message": "Market data not available",
            "commodity": commodity,
            "state": state
        }

    @classmethod
    async def compare_product_price(
        cls,
        product_id: str
    ) -> Dict[str, Any]:
        """
        Compares a product's price against the average/modal market price for its commodity.
        Returns difference percentage and a 'fair' / 'high' / 'low' verdict.
        """
        supabase = get_supabase()

        # Fetch the product
        prod_res = supabase.table("products").select("id, name, price, tags, category_id, category:category_id(name)").eq("id", product_id).execute()
        if not prod_res.data or len(prod_res.data) == 0:
            return {
                "product_id": product_id,
                "product_name": "Unknown",
                "product_price": 0.0,
                "market_modal_price": None,
                "difference_percent": None,
                "verdict": "unknown",
                "message": f"Product '{product_id}' not found"
            }

        product = prod_res.data[0]
        prod_name = product.get("name", "")
        prod_price = float(product.get("price", 0.0))

        # Infer commodity name from product name or tags
        commodity = None
        tags = product.get("tags") or []
        for tag in tags:
            for def_comm in DEFAULT_COMMODITIES:
                if def_comm.lower() in tag.lower():
                    commodity = def_comm
                    break
            if commodity:
                break

        if not commodity:
            for def_comm in DEFAULT_COMMODITIES:
                if def_comm.lower() in prod_name.lower():
                    commodity = def_comm
                    break

        if not commodity:
            # Fallback to first word of product name
            commodity = prod_name.split()[0] if prod_name else "General"

        # Fetch market prices
        price_result = await cls.get_market_prices(commodity)
        price_items = price_result.get("data")

        if not price_items or len(price_items) == 0:
            return {
                "product_id": product_id,
                "product_name": prod_name,
                "product_price": prod_price,
                "market_modal_price": None,
                "difference_percent": None,
                "verdict": "unknown",
                "commodity": commodity,
                "message": "Market data not available for comparison"
            }

        # Calculate average modal price from available market data
        modal_prices = [float(item.get("modal_price", 0)) for item in price_items if float(item.get("modal_price", 0)) > 0]
        if not modal_prices:
            return {
                "product_id": product_id,
                "product_name": prod_name,
                "product_price": prod_price,
                "market_modal_price": None,
                "difference_percent": None,
                "verdict": "unknown",
                "commodity": commodity,
                "message": "Market modal price unavailable"
            }

        avg_modal = sum(modal_prices) / len(modal_prices)
        diff_percent = ((prod_price - avg_modal) / avg_modal) * 100.0

        # Verdict logic: +/- 10% tolerance is considered fair
        if -10.0 <= diff_percent <= 10.0:
            verdict = "fair"
        elif diff_percent > 10.0:
            verdict = "high"
        else:
            verdict = "low"

        return {
            "product_id": product_id,
            "product_name": prod_name,
            "product_price": prod_price,
            "market_modal_price": round(avg_modal, 2),
            "difference_percent": round(diff_percent, 2),
            "verdict": verdict,
            "commodity": commodity,
            "message": f"Product price is {verdict} compared to current market mandi rates"
        }

    @classmethod
    async def sync_all_commodities(cls) -> Dict[str, Any]:
        """
        Triggers data.gov.in sync for standard agricultural commodities.
        """
        synced = []
        failed = []
        for comm in DEFAULT_COMMODITIES:
            try:
                res = await cls.fetch_from_data_gov(comm)
                if res:
                    synced.append(comm)
                else:
                    failed.append(comm)
            except Exception:
                failed.append(comm)

        return {
            "synced_commodities": synced,
            "failed_or_empty": failed,
            "total_synced": len(synced),
            "message": "Market price sync process completed"
        }
