"""
Sellers router.
Handles viewing verified seller profiles, business information, and seller product catalogs.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.database import get_supabase
from app.models.product import SellerBasicInfo, ProductResponse
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/sellers", tags=["Sellers"])


class SellerProfileDetailResponse(SellerBasicInfo):
    """Detailed seller profile including active product inventory."""
    gstin_or_license: str = None
    created_at: str = None
    products: List[ProductResponse] = []


# Route: GET /api/sellers
# Purpose: List all verified sellers registered on AgriMart
@router.get(
    "/",
    response_model=List[SellerBasicInfo],
    status_code=status.HTTP_200_OK,
    summary="List all verified sellers",
)
async def list_verified_sellers():
    """
    Returns a list of all verified sellers operating on the platform.
    """
    supabase = get_supabase()
    try:
        res = supabase.table("profiles").select(
            "id, full_name, business_name, phone_number, avatar_url, is_verified"
        ).eq("role", "seller").order("business_name").execute()

        return res.data or []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing sellers: {str(e)}",
        )


# Route: GET /api/sellers/{seller_id}
# Purpose: Retrieve a specific seller profile along with all their active listed products
@router.get(
    "/{seller_id}",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Get seller profile with active products",
)
async def get_seller_profile(seller_id: str):
    """
    Returns the public seller profile along with their active product listings.
    """
    supabase = get_supabase()

    # 1. Fetch seller profile
    profile = SupabaseService.fetch_seller_profile(seller_id)

    # 2. Fetch active products listed by this seller
    prod_result = SupabaseService.fetch_products(
        seller_id=seller_id,
        page=1,
        limit=100,
        only_active=True,
    )

    profile_data = dict(profile)
    profile_data["products"] = prod_result.get("data", [])

    return profile_data
