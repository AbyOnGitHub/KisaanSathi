"""
Categories router.
Handles retrieving product categories available in the AgriMart marketplace.
"""

from typing import List
from fastapi import APIRouter, status
from app.models.category import CategoryResponse
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/categories", tags=["Categories"])


# Route: GET /api/categories
# Purpose: Fetch and return all product categories (e.g., Seeds, Fertilizers, Tools)
@router.get(
    "/",
    response_model=List[CategoryResponse],
    status_code=status.HTTP_200_OK,
    summary="List all product categories",
)
async def list_categories():
    """
    Returns a list of all product categories available in the marketplace,
    sorted alphabetically by name.
    """
    categories = SupabaseService.fetch_all_categories()
    return categories
