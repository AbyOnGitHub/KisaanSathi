"""
Supabase service layer containing helper functions for interacting with database tables.
Provides clean query methods with error handling and relational mapping.
"""

from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from app.database import get_supabase


class SupabaseService:
    """Helper service for executing Supabase operations."""

    @staticmethod
    def get_client():
        """Returns the active Supabase client instance."""
        return get_supabase()

    @staticmethod
    def fetch_all_categories() -> List[Dict[str, Any]]:
        """Fetch all categories sorted by name."""
        supabase = get_supabase()
        try:
            res = supabase.table("categories").select("*").order("name").execute()
            return res.data or []
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch categories: {str(e)}"
            )

    @staticmethod
    def fetch_products(
        category_slug: Optional[str] = None,
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sort_by: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
        seller_id: Optional[str] = None,
        only_active: bool = True
    ) -> Dict[str, Any]:
        """
        Fetch products with search, filtering, sorting, and pagination.
        Includes seller and category relational data.
        """
        supabase = get_supabase()
        try:
            # Base query including related category and seller profiles
            query = supabase.table("products").select(
                "*, category:category_id(*), seller:seller_id(id, full_name, business_name, phone_number, avatar_url, is_verified)",
                count="exact"
            )

            if only_active:
                query = query.eq("is_active", True)

            if seller_id:
                query = query.eq("seller_id", seller_id)

            if category_slug:
                # Find category ID first for slug
                cat_res = supabase.table("categories").select("id").eq("slug", category_slug).execute()
                if cat_res.data and len(cat_res.data) > 0:
                    cat_id = cat_res.data[0]["id"]
                    query = query.eq("category_id", cat_id)
                else:
                    return {"data": [], "page": page, "limit": limit, "total": 0}

            if search:
                query = query.ilike("name", f"%{search}%")

            if min_price is not None:
                query = query.gte("price", min_price)

            if max_price is not None:
                query = query.lte("price", max_price)

            # Sorting logic
            if sort_by == "price_asc" or sort_by == "price":
                query = query.order("price", desc=False)
            elif sort_by == "price_desc":
                query = query.order("price", desc=True)
            elif sort_by == "rating":
                query = query.order("rating", desc=True)
            else:
                # Default newest first
                query = query.order("created_at", desc=True)

            # Pagination range (0-indexed in Supabase PostgREST)
            offset = (page - 1) * limit
            query = query.range(offset, offset + limit - 1)

            res = query.execute()
            total_count = res.count if res.count is not None else len(res.data or [])

            return {
                "data": res.data or [],
                "page": page,
                "limit": limit,
                "total": total_count
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to query products: {str(e)}"
            )

    @staticmethod
    def fetch_product_by_id(product_id: str) -> Dict[str, Any]:
        """Fetch a single product by ID including category and seller details."""
        supabase = get_supabase()
        try:
            res = supabase.table("products").select(
                "*, category:category_id(*), seller:seller_id(id, full_name, business_name, phone_number, avatar_url, is_verified)"
            ).eq("id", product_id).execute()

            if not res.data or len(res.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with ID '{product_id}' not found"
                )
            return res.data[0]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching product: {str(e)}"
            )

    @staticmethod
    def fetch_seller_profile(seller_id: str) -> Dict[str, Any]:
        """Fetch a seller profile from the profiles table."""
        supabase = get_supabase()
        try:
            res = supabase.table("profiles").select("*").eq("id", seller_id).eq("role", "seller").execute()
            if not res.data or len(res.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Seller profile with ID '{seller_id}' not found"
                )
            return res.data[0]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching seller profile: {str(e)}"
            )
