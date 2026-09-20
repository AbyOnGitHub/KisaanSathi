"""
Payments Router for AgriMart.
Handles Razorpay order initiation, cryptographic HMAC signature verification,
cart cleanup upon payment, stock decrement, and payment status polling.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.database import get_supabase
from app.config import settings
from app.services.razorpay_service import RazorpayService
from app.models.payment import (
    PaymentOrderCreateRequest,
    RazorpayOrderResponse,
    RazorpayPrefill,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
    PaymentStatusResponse,
)

router = APIRouter(prefix="/api/payments", tags=["Payments"])


# Route: POST /api/payments/create-order
# Purpose: Initialize a Razorpay test order from the user's active shopping cart
@router.post(
    "/create-order",
    response_model=RazorpayOrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Razorpay payment order from cart",
)
async def create_payment_order(
    payload: PaymentOrderCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    1. Validates the user has items in their cart.
    2. Calculates line item totals (respecting bargained prices if accepted).
    3. Creates a pending order in the database.
    4. Creates a Razorpay test order for the total amount in paise.
    5. Stores the razorpay_order_id in the database order.
    6. Returns Razorpay order parameters and public key ID to frontend.
    (Note: Cart is preserved until payment verification succeeds).
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
            detail="Cannot create payment order from an empty cart",
        )

    # 2. Calculate grand total and prepare line items
    calculated_total = 0.0
    prepared_items = []

    for item in cart_items:
        product = item.get("product")
        if not product:
            continue

        base_price = float(product.get("price", 0.0))
        discount = float(product.get("discount_percent", 0.0))
        discounted_price = round(base_price * (1.0 - (discount / 100.0)), 2)

        # Use negotiated bargained price if present, else standard discounted price
        bargained = item.get("bargained_price")
        unit_price = (
            float(bargained)
            if (bargained is not None and float(bargained) > 0)
            else discounted_price
        )

        qty = int(item.get("quantity", 1))
        calculated_total += unit_price * qty

        prepared_items.append({
            "product_id": item["product_id"],
            "seller_id": product["seller_id"],
            "quantity": qty,
            "price_at_purchase": unit_price,
        })

    rounded_total = round(calculated_total, 2)
    if rounded_total <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order total must be greater than zero",
        )

    try:
        # 3. Create DB order with pending status
        order_insert_data = {
            "user_id": user_id,
            "total_amount": rounded_total,
            "status": "pending",
            "payment_status": "pending",
            "shipping_address": payload.shipping_address,
            "shipping_city": payload.shipping_city,
            "shipping_state": payload.shipping_state,
            "shipping_pincode": payload.shipping_pincode,
        }

        order_res = supabase.table("orders").insert(order_insert_data).execute()
        if not order_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initialize order record in database",
            )

        new_order = order_res.data[0]
        order_id = new_order["id"]

        # 4. Insert order line items
        for item_data in prepared_items:
            item_data["order_id"] = order_id

        supabase.table("order_items").insert(prepared_items).execute()

        # 5. Create Razorpay order via Razorpay service (amount in paise)
        notes = {
            "agrimart_order_id": str(order_id),
            "user_id": str(user_id),
            "mode": settings.PAYMENT_MODE,
        }
        razorpay_order = RazorpayService.create_razorpay_order(
            amount_rupees=rounded_total,
            receipt=str(order_id),
            notes=notes,
        )

        razorpay_order_id = razorpay_order["id"]

        # 6. Update DB order with razorpay_order_id
        supabase.table("orders").update(
            {"razorpay_order_id": razorpay_order_id}
        ).eq("id", order_id).execute()

        # 7. Fetch user profile for prefill data
        profile_res = supabase.table("profiles").select("*").eq("id", user_id).execute()
        profile_data = profile_res.data[0] if (profile_res.data and len(profile_res.data) > 0) else {}

        prefill_name = profile_data.get("full_name") or current_user.get("full_name") or "Farmer Buyer"
        prefill_phone = profile_data.get("phone_number") or current_user.get("phone_number") or ""
        prefill_email = current_user.get("email") or ""

        return RazorpayOrderResponse(
            order_id=str(order_id),
            razorpay_order_id=str(razorpay_order_id),
            amount=int(razorpay_order["amount"]),
            currency="INR",
            key_id=settings.RAZORPAY_KEY_ID,
            prefill=RazorpayPrefill(
                name=prefill_name,
                contact=prefill_phone,
                email=prefill_email,
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error initiating payment order: {str(e)}",
        )


# Route: POST /api/payments/verify
# Purpose: Validate Razorpay payment signature, mark order as paid, empty cart, and decrement stock
@router.post(
    "/verify",
    response_model=PaymentVerifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify Razorpay payment signature",
)
async def verify_payment(
    payload: PaymentVerifyRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    1. Verifies the cryptographic HMAC SHA256 signature returned by Razorpay.
    2. Validates order existence and user authorization.
    3. Updates order status to 'confirmed' and payment_status to 'paid'.
    4. Saves razorpay_payment_id and razorpay_signature on the order record.
    5. Empties the user's shopping cart.
    6. Safely decrements inventory stock for all purchased items.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    # 1. Fetch target order
    order_res = supabase.table("orders").select("*").eq("id", payload.order_id).execute()
    if not order_res.data or len(order_res.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID '{payload.order_id}' not found",
        )

    order_data = order_res.data[0]

    # Check ownership
    if order_data["user_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to verify payment for this order",
        )

    # Check if already paid
    if order_data.get("payment_status") == "paid":
        return PaymentVerifyResponse(
            success=True,
            message="Payment has already been verified and processed",
            order_id=payload.order_id,
            payment_status="paid",
            order=order_data,
        )

    # 2. Verify signature with Razorpay utility
    is_valid = RazorpayService.verify_payment_signature(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
    )

    if not is_valid:
        # Mark payment status as failed in database
        supabase.table("orders").update(
            {"payment_status": "failed"}
        ).eq("id", payload.order_id).execute()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment signature verification failed. Please try again or contact support.",
        )

    try:
        # 3. Mark order as paid & confirmed
        update_data = {
            "payment_status": "paid",
            "status": "confirmed",
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature,
        }

        updated_order_res = supabase.table("orders").update(
            update_data
        ).eq("id", payload.order_id).execute()

        updated_order = updated_order_res.data[0] if updated_order_res.data else order_data

        # 4. Clear user's shopping cart
        supabase.table("cart_items").delete().eq("user_id", user_id).execute()

        # 5. Decrement product stock safely
        items_res = supabase.table("order_items").select(
            "product_id, quantity"
        ).eq("order_id", payload.order_id).execute()

        for it in (items_res.data or []):
            prod_id = it.get("product_id")
            qty = int(it.get("quantity", 0))
            if prod_id and qty > 0:
                p_res = supabase.table("products").select("stock").eq("id", prod_id).execute()
                if p_res.data and len(p_res.data) > 0:
                    current_stock = int(p_res.data[0].get("stock", 0))
                    new_stock = max(0, current_stock - qty)
                    supabase.table("products").update(
                        {"stock": new_stock}
                    ).eq("id", prod_id).execute()

        return PaymentVerifyResponse(
            success=True,
            message="Payment verified successfully",
            order_id=payload.order_id,
            payment_status="paid",
            order=updated_order,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error finalizing order payment: {str(e)}",
        )


# Route: GET /api/payments/{order_id}/status
# Purpose: Check current payment and fulfillment status for an order
@router.get(
    "/{order_id}/status",
    response_model=PaymentStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get order payment status",
)
async def get_payment_status(
    order_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Returns the real-time payment_status and fulfillment status of an order.
    Authorized for the buyer who placed it, sellers involved, or administrators.
    """
    supabase = get_supabase()
    user_id = current_user["id"]
    role = current_user.get("role", "farmer")

    order_res = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not order_res.data or len(order_res.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID '{order_id}' not found",
        )

    order_data = order_res.data[0]

    # Permission check
    is_buyer = order_data["user_id"] == user_id
    if not is_buyer and role != "admin":
        # Check if seller has items in this order
        seller_items = supabase.table("order_items").select("id").eq("order_id", order_id).eq("seller_id", user_id).execute()
        if not seller_items.data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view payment status for this order",
            )

    return PaymentStatusResponse(
        order_id=order_id,
        status=order_data.get("status", "pending"),
        payment_status=order_data.get("payment_status", "pending"),
    )
