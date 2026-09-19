"""
Cart router.
Handles viewing, adding, updating, and removing items in the farmer's shopping cart.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.database import get_supabase
from app.models.cart import (
    CartItemAdd,
    CartItemUpdate,
    CartResponse,
    CartItemResponse,
)
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/cart", tags=["Cart"])


def _calculate_cart_response(cart_rows: list) -> CartResponse:
    """Helper to compute effective unit prices, line item totals, and grand total."""
    items = []
    grand_total = 0.0
    total_qty = 0

    for row in cart_rows:
        prod_data = row.get("product")
        if not prod_data:
            continue

        base_price = float(prod_data.get("price", 0.0))
        discount = float(prod_data.get("discount_percent", 0.0))
        discounted_price = round(base_price * (1.0 - (discount / 100.0)), 2)

        # Use negotiated bargained price if available and valid, otherwise standard discounted price
        bargained = row.get("bargained_price")
        if bargained is not None and float(bargained) > 0:
            effective_price = float(bargained)
        else:
            effective_price = discounted_price

        qty = int(row.get("quantity", 1))
        item_total = round(effective_price * qty, 2)
        grand_total += item_total
        total_qty += qty

        items.append(
            CartItemResponse(
                id=row["id"],
                user_id=row["user_id"],
                product_id=row["product_id"],
                quantity=qty,
                bargained_price=bargained,
                created_at=row.get("created_at"),
                effective_unit_price=effective_price,
                item_total=item_total,
                product=prod_data,
            )
        )

    return CartResponse(
        items=items,
        total_items=total_qty,
        total_amount=round(grand_total, 2),
    )


# Route: GET /api/cart
# Purpose: Retrieve the current authenticated user's shopping cart with full product details and price totals
@router.get(
    "/",
    response_model=CartResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user's cart",
)
async def get_cart(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns all items currently in the authenticated user's cart,
    including embedded product details and computed totals.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    try:
        res = supabase.table("cart_items").select(
            "*, product:product_id(*, category:category_id(*), seller:seller_id(id, full_name, business_name, phone_number, avatar_url, is_verified))"
        ).eq("user_id", user_id).order("created_at", desc=False).execute()

        return _calculate_cart_response(res.data or [])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching cart: {str(e)}",
        )


# Route: POST /api/cart/add
# Purpose: Add a product to the cart (or increment quantity if already present in cart)
@router.post(
    "/add",
    response_model=CartResponse,
    status_code=status.HTTP_200_OK,
    summary="Add an item to cart (upsert)",
)
async def add_to_cart(
    payload: CartItemAdd,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Adds a product to the cart. If the product is already in the cart, its quantity is increased.
    Validates minimum order quantity and stock availability.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    # Validate product exists and is active
    prod = SupabaseService.fetch_product_by_id(payload.product_id)
    if not prod.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add inactive product to cart",
        )

    # Check stock
    available_stock = prod.get("stock", 0)
    if available_stock < payload.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity ({payload.quantity}) exceeds available stock ({available_stock})",
        )

    try:
        # Check if already exists in user's cart
        existing = supabase.table("cart_items").select("*").eq("user_id", user_id).eq("product_id", payload.product_id).execute()
        
        if existing.data and len(existing.data) > 0:
            existing_item = existing.data[0]
            new_qty = existing_item["quantity"] + payload.quantity
            if new_qty > available_stock:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Total quantity ({new_qty}) exceeds available stock ({available_stock})",
                )
            update_fields = {"quantity": new_qty}
            if payload.bargained_price is not None:
                update_fields["bargained_price"] = payload.bargained_price
            
            supabase.table("cart_items").update(update_fields).eq("id", existing_item["id"]).execute()
        else:
            new_item = {
                "user_id": user_id,
                "product_id": payload.product_id,
                "quantity": payload.quantity,
                "bargained_price": payload.bargained_price,
            }
            supabase.table("cart_items").insert(new_item).execute()

        return await get_cart(current_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding to cart: {str(e)}",
        )


# Route: PUT /api/cart/update
# Purpose: Update the quantity of a specific product in the shopping cart
@router.put(
    "/update",
    response_model=CartResponse,
    status_code=status.HTTP_200_OK,
    summary="Update cart item quantity",
)
async def update_cart_item(
    payload: CartItemUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Sets a new quantity for a product in the user's cart.
    Validates against maximum available stock.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    prod = SupabaseService.fetch_product_by_id(payload.product_id)
    if payload.quantity > prod.get("stock", 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Quantity exceeds available stock of {prod.get('stock', 0)}",
        )

    try:
        res = supabase.table("cart_items").update(
            {"quantity": payload.quantity}
        ).eq("user_id", user_id).eq("product_id", payload.product_id).execute()

        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product is not in your cart",
            )
        return await get_cart(current_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating cart: {str(e)}",
        )


# Route: DELETE /api/cart/remove/{product_id}
# Purpose: Remove a single product from the user's shopping cart
@router.delete(
    "/remove/{product_id}",
    response_model=CartResponse,
    status_code=status.HTTP_200_OK,
    summary="Remove an item from cart",
)
async def remove_from_cart(
    product_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Deletes the selected product item from the user's cart.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    try:
        supabase.table("cart_items").delete().eq("user_id", user_id).eq("product_id", product_id).execute()
        return await get_cart(current_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error removing item from cart: {str(e)}",
        )


# Route: DELETE /api/cart/clear
# Purpose: Remove all items from the current user's shopping cart
@router.delete(
    "/clear",
    status_code=status.HTTP_200_OK,
    summary="Clear entire cart",
)
async def clear_cart(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Empties the current user's entire shopping cart.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    try:
        supabase.table("cart_items").delete().eq("user_id", user_id).execute()
        return {"detail": "Cart successfully emptied"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error clearing cart: {str(e)}",
        )
