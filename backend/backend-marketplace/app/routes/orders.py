"""
Orders router.
Handles checkout order creation from cart, order history, single order tracking,
seller received orders, and status updates.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user, require_seller
from app.database import get_supabase
from app.models.order import (
    OrderCreate,
    OrderStatusUpdate,
    OrderResponse,
    OrderListResponse,
)

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def _format_order_response(order_row: dict, items_rows: list = None) -> OrderResponse:
    """Helper to structure order entity with its line items and products."""
    items = []
    if items_rows:
        for it in items_rows:
            items.append({
                "id": it.get("id"),
                "order_id": it.get("order_id"),
                "product_id": it.get("product_id"),
                "seller_id": it.get("seller_id"),
                "quantity": it.get("quantity"),
                "price_at_purchase": float(it.get("price_at_purchase", 0.0)),
                "product": it.get("product"),
            })

    return OrderResponse(
        id=order_row["id"],
        user_id=order_row["user_id"],
        total_amount=float(order_row["total_amount"]),
        status=order_row.get("status", "pending"),
        payment_status=order_row.get("payment_status", "pending"),
        razorpay_order_id=order_row.get("razorpay_order_id"),
        razorpay_payment_id=order_row.get("razorpay_payment_id"),
        razorpay_signature=order_row.get("razorpay_signature"),
        shipping_address=order_row.get("shipping_address"),
        shipping_city=order_row.get("shipping_city"),
        shipping_state=order_row.get("shipping_state"),
        shipping_pincode=order_row.get("shipping_pincode"),
        created_at=order_row.get("created_at"),
        updated_at=order_row.get("updated_at"),
        items=items,
    )


# Route: POST /api/orders/create
# Purpose: Convert user's shopping cart into a placed order with status 'pending'
@router.post(
    "/create",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create order from cart",
)
async def create_order(
    payload: OrderCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Creates a new order using the items in the user's active cart.
    Calculates total, records unit price at purchase, creates order items,
    and empties the cart. (Payment integration will be added in a future phase).
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    # 1. Fetch user's cart items with product details
    cart_res = supabase.table("cart_items").select(
        "*, product:product_id(*)"
    ).eq("user_id", user_id).execute()

    cart_items = cart_res.data or []
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create order from an empty cart",
        )

    # 2. Calculate total and prepare line items
    calculated_total = 0.0
    prepared_items = []

    for item in cart_items:
        product = item.get("product")
        if not product:
            continue

        base_price = float(product.get("price", 0.0))
        discount = float(product.get("discount_percent", 0.0))
        discounted_price = round(base_price * (1.0 - (discount / 100.0)), 2)

        # Use bargained price if settled in session/cart, otherwise standard discounted price
        bargained = item.get("bargained_price")
        unit_price = float(bargained) if (bargained is not None and float(bargained) > 0) else discounted_price

        qty = int(item.get("quantity", 1))
        calculated_total += unit_price * qty

        prepared_items.append({
            "product_id": item["product_id"],
            "seller_id": product["seller_id"],
            "quantity": qty,
            "price_at_purchase": unit_price,
        })

    # 3. Insert order record
    order_insert_data = {
        "user_id": user_id,
        "total_amount": round(calculated_total, 2),
        "status": "pending",
        "payment_status": "pending",
        "shipping_address": payload.shipping_address,
        "shipping_city": payload.shipping_city,
        "shipping_state": payload.shipping_state,
        "shipping_pincode": payload.shipping_pincode,
    }

    try:
        order_res = supabase.table("orders").insert(order_insert_data).execute()
        if not order_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order record",
            )
        new_order = order_res.data[0]
        order_id = new_order["id"]

        # 4. Insert order_items
        for item_data in prepared_items:
            item_data["order_id"] = order_id
        
        supabase.table("order_items").insert(prepared_items).execute()

        # 5. Clear cart
        supabase.table("cart_items").delete().eq("user_id", user_id).execute()

        # 6. Fetch complete created order with items
        items_res = supabase.table("order_items").select(
            "*, product:product_id(*, category:category_id(*))"
        ).eq("order_id", order_id).execute()

        return _format_order_response(new_order, items_res.data or [])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating order: {str(e)}",
        )


# Route: GET /api/orders
# Purpose: Fetch order history for the current authenticated user
@router.get(
    "/",
    response_model=OrderListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user's order history",
)
async def get_user_orders(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns all previous orders placed by the authenticated user, sorted by most recent first.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    try:
        orders_res = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        orders_data = orders_res.data or []

        order_responses = []
        for o in orders_data:
            items_res = supabase.table("order_items").select(
                "*, product:product_id(*, category:category_id(*))"
            ).eq("order_id", o["id"]).execute()
            order_responses.append(_format_order_response(o, items_res.data or []))

        return OrderListResponse(data=order_responses, total=len(order_responses))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching orders: {str(e)}",
        )


# Route: GET /api/orders/seller/received
# Purpose: Fetch all orders containing products sold by the current authenticated seller
@router.get(
    "/seller/received",
    response_model=OrderListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get orders received by current seller",
)
async def get_seller_received_orders(
    current_user: Dict[str, Any] = Depends(require_seller),
):
    """
    Allows a seller to view all customer orders containing products from their store catalog.
    """
    supabase = get_supabase()
    seller_id = current_user["id"]

    try:
        # Get order items where seller_id matches
        seller_items_res = supabase.table("order_items").select(
            "order_id"
        ).eq("seller_id", seller_id).execute()

        order_ids = list(set(it["order_id"] for it in (seller_items_res.data or [])))
        if not order_ids:
            return OrderListResponse(data=[], total=0)

        orders_res = supabase.table("orders").select("*").in_("id", order_ids).order("created_at", desc=True).execute()
        orders_data = orders_res.data or []

        order_responses = []
        for o in orders_data:
            items_res = supabase.table("order_items").select(
                "*, product:product_id(*, category:category_id(*))"
            ).eq("order_id", o["id"]).eq("seller_id", seller_id).execute()
            order_responses.append(_format_order_response(o, items_res.data or []))

        return OrderListResponse(data=order_responses, total=len(order_responses))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching seller orders: {str(e)}",
        )


# Route: GET /api/orders/{order_id}
# Purpose: Retrieve full details of a specific order by ID
@router.get(
    "/{order_id}",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single order details",
)
async def get_single_order(
    order_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Returns order details including line items for a given order ID.
    Authorized for the buyer who placed it, the seller of the items, or admins.
    """
    supabase = get_supabase()
    user_id = current_user["id"]
    role = current_user.get("role", "farmer")

    try:
        order_res = supabase.table("orders").select("*").eq("id", order_id).execute()
        if not order_res.data or len(order_res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID '{order_id}' not found",
            )

        order_data = order_res.data[0]
        items_res = supabase.table("order_items").select(
            "*, product:product_id(*, category:category_id(*))"
        ).eq("order_id", order_id).execute()
        items_data = items_res.data or []

        # Permission check: buyer or seller involved
        is_buyer = order_data["user_id"] == user_id
        is_seller = any(it.get("seller_id") == user_id for it in items_data)

        if not (is_buyer or is_seller or role == "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this order",
            )

        return _format_order_response(order_data, items_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching order: {str(e)}",
        )


# Route: PUT /api/orders/{order_id}/status
# Purpose: Update the fulfillment status of an order (e.g. confirmed, shipped, delivered)
@router.put(
    "/{order_id}/status",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK,
    summary="Seller updates order status",
)
async def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    current_user: Dict[str, Any] = Depends(require_seller),
):
    """
    Allows a seller associated with the order to update its status (confirmed, shipped, delivered, cancelled).
    """
    supabase = get_supabase()
    seller_id = current_user["id"]

    try:
        # Verify seller has items in this order
        items_res = supabase.table("order_items").select("id").eq("order_id", order_id).eq("seller_id", seller_id).execute()
        if not items_res.data and current_user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update orders that contain your listed products",
            )

        supabase.table("orders").update(
            {"status": payload.status}
        ).eq("id", order_id).execute()

        return await get_single_order(order_id, current_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating order status: {str(e)}",
        )
