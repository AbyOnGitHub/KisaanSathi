"""
Order Pydantic models for checkout, order tracking, and status updates.
"""

from typing import Optional, List, Any, Literal
from pydantic import BaseModel, Field, ConfigDict
from app.models.product import ProductResponse


class OrderCreate(BaseModel):
    """Payload for creating a new order from current cart."""
    shipping_address: str = Field(..., min_length=5, description="Street address")
    shipping_city: str = Field(..., min_length=2, description="City")
    shipping_state: str = Field(..., min_length=2, description="State")
    shipping_pincode: str = Field(..., min_length=4, max_length=10, description="Postal / PIN code")


class OrderStatusUpdate(BaseModel):
    """Payload for seller/admin updating the status of an order."""
    status: Literal["pending", "confirmed", "shipped", "delivered", "cancelled"] = Field(
        ..., description="New order delivery status"
    )


class OrderItemResponse(BaseModel):
    """Response model for individual items within an order."""
    id: Any
    order_id: Any
    product_id: Any
    seller_id: Any
    quantity: int
    price_at_purchase: float
    product: Optional[ProductResponse] = None

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    """Full order response with order metadata and line items."""
    id: Any
    user_id: Any
    total_amount: float
    status: str = "pending"
    payment_status: str = "pending"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    shipping_address: Optional[str] = None
    shipping_city: Optional[str] = None
    shipping_state: Optional[str] = None
    shipping_pincode: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    items: List[OrderItemResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class OrderListResponse(BaseModel):
    """List response for orders."""
    data: List[OrderResponse]
    total: int
