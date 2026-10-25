"""
Market Prices router.
Handles querying live government Mandi prices, comparing product rates with market trends,
and administrative price synchronization.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Query, status
from app.models.market_price import (
    MarketPriceResponse,
    PriceComparisonResponse,
)
from app.services.market_price_service import MarketPriceService

router = APIRouter(prefix="/api/market-prices", tags=["Market Prices"])


# Route: GET /api/market-prices/{commodity}
# Purpose: Get the latest market mandi prices for a given agricultural commodity (e.g., Wheat, Rice)
@router.get(
    "/{commodity}",
    response_model=MarketPriceResponse,
    status_code=status.HTTP_200_OK,
    summary="Get latest market price for commodity",
)
async def get_market_price(
    commodity: str,
    state: Optional[str] = Query(None, description="Optional Indian state filter (e.g. Maharashtra, Punjab)"),
):
    """
    Fetches market prices for the specified agricultural commodity.
    Checks the local database cache first (invalidated after 24 hours),
    falling back to fetching live data from data.gov.in Mandi API.
    Gracefully returns null if external data is unavailable.
    """
    result = await MarketPriceService.get_market_prices(commodity, state)
    return result


# Route: GET /api/market-prices/compare/{product_id}
# Purpose: Compare a product's price against current modal market mandi rates
@router.get(
    "/compare/{product_id}",
    response_model=PriceComparisonResponse,
    status_code=status.HTTP_200_OK,
    summary="Compare product price with market rates",
)
async def compare_product_price(product_id: str):
    """
    Computes the price difference percentage between a marketplace product
    and current government Mandi rates, issuing a 'fair', 'high', or 'low' verdict.
    """
    result = await MarketPriceService.compare_product_price(product_id)
    return result


# Route: POST /api/market-prices/sync
# Purpose: Administrative/manual trigger to fetch and refresh commodity prices from data.gov.in
@router.post(
    "/sync",
    status_code=status.HTTP_200_OK,
    summary="Trigger market price synchronization",
)
async def trigger_market_sync():
    """
    Manually initiates data refresh for key agricultural commodities from data.gov.in.
    """
    result = await MarketPriceService.sync_all_commodities()
    return result
