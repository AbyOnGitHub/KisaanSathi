"""
Products router.
Handles product discovery, filtering, search, pagination, and seller product management.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies import get_current_user, require_seller
from app.database import get_supabase
from app.models.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
)
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/products", tags=["Products"])


# Route: GET /api/products
# Purpose: List active products with optional search, category filter, price range, sorting, and pagination
@router.get(
    "/",
    response_model=ProductListResponse,
    status_code=status.HTTP_200_OK,
    summary="List products with filtering and pagination",
)
async def list_products(
    category: Optional[str] = Query(None, description="Category slug to filter by"),
    search: Optional[str] = Query(None, description="Search term for product name"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    sort_by: Optional[str] = Query(
        "created_at",
        description="Sort order: 'price_asc', 'price_desc', 'rating', or 'created_at'",
    ),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Number of items per page"),
):
    """
    Returns a paginated list of active marketplace products matching the applied filters,
    including embedded seller and category metadata.
    """
    result = SupabaseService.fetch_products(
        category_slug=category,
        search=search,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        page=page,
        limit=limit,
        only_active=True,
    )
    return result


# Route: GET /api/products/seller/{seller_id}
# Purpose: Fetch all active products listed by a specific seller
@router.get(
    "/seller/{seller_id}",
    response_model=List[ProductResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all products for a specific seller",
)
async def get_products_by_seller(seller_id: str):
    """
    Retrieves all active product listings belonging to the given seller ID.
    """
    result = SupabaseService.fetch_products(
        seller_id=seller_id,
        page=1,
        limit=100,
        only_active=True,
    )
    return result["data"]


# Route: GET /api/products/{product_id}
# Purpose: Fetch full details of a single product by its unique ID
@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single product details",
)
async def get_product(product_id: str):
    """
    Returns single product details with seller and category information.
    Raises 404 if the product does not exist.
    """
    return SupabaseService.fetch_product_by_id(product_id)


# Route: POST /api/products
# Purpose: Create a new product listing (restricted to authenticated sellers)
@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product listing",
)
async def create_product(
    payload: ProductCreate,
    current_user: Dict[str, Any] = Depends(require_seller),
):
    """
    Allows a verified seller to publish a new product in the marketplace.
    The seller_id is automatically assigned from the authenticated user.
    """
    supabase = get_supabase()
    seller_id = current_user["id"]

    # Verify category exists
    cat_res = supabase.table("categories").select("id").eq("id", payload.category_id).execute()
    if not cat_res.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with ID '{payload.category_id}' does not exist",
        )

    product_dict = payload.model_dump()
    product_dict["seller_id"] = seller_id
    product_dict["is_active"] = True

    try:
        res = supabase.table("products").insert(product_dict).execute()
        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create product record",
            )
        new_prod_id = res.data[0]["id"]
        return SupabaseService.fetch_product_by_id(new_prod_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating product: {str(e)}",
        )


# Route: PUT /api/products/{product_id}
# Purpose: Update product details (only the product's seller owner can update)
@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing product",
)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    current_user: Dict[str, Any] = Depends(require_seller),
):
    """
    Updates fields of an existing product. Only the seller who created the product can update it.
    """
    supabase = get_supabase()
    seller_id = current_user["id"]

    # Check ownership
    existing = supabase.table("products").select("id, seller_id").eq("id", product_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found",
        )

    if existing.data[0]["seller_id"] != seller_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this product",
        )

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        return SupabaseService.fetch_product_by_id(product_id)

    try:
        supabase.table("products").update(update_data).eq("id", product_id).execute()
        return SupabaseService.fetch_product_by_id(product_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating product: {str(e)}",
        )


# Route: DELETE /api/products/{product_id}
# Purpose: Soft delete a product by setting is_active=false (only seller owner)
@router.delete(
    "/{product_id}",
    status_code=status.HTTP_200_OK,
    summary="Soft delete a product listing",
)
async def delete_product(
    product_id: str,
    current_user: Dict[str, Any] = Depends(require_seller),
):
    """
    Soft-deletes a product by setting is_active=false.
    Only the owning seller can perform this action.
    """
    supabase = get_supabase()
    seller_id = current_user["id"]

    # Check ownership
    existing = supabase.table("products").select("id, seller_id").eq("id", product_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found",
        )

    if existing.data[0]["seller_id"] != seller_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this product",
        )

    try:
        supabase.table("products").update({"is_active": False}).eq("id", product_id).execute()
        return {"detail": "Product successfully deleted (deactivated)"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting product: {str(e)}",
        )
