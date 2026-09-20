"""
Cart Pydantic models for request validation and response serialization.
"""

from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict
from app.models.product import ProductResponse


class CartItemAdd(BaseModel):
    """Payload for adding an item to the shopping cart."""
    product_id: Any = Field(..., description="ID of the product to add")
    quantity: int = Field(1, gt=0, description="Quantity to add (must be at least 1)")
    bargained_price: Optional[float] = Field(None, gt=0, description="Agreed bargained price per unit if applicable")


class CartItemUpdate(BaseModel):
    """Payload for updating quantity of an existing item in the shopping cart."""
    product_id: Any = Field(..., description="ID of the product to update")
    quantity: int = Field(..., gt=0, description="New quantity (must be at least 1)")


class CartItemResponse(BaseModel):
    """Response model for a single cart item."""
    id: Any
    user_id: Any
    product_id: Any
    quantity: int
    bargained_price: Optional[float] = None
    created_at: Optional[str] = None
    effective_unit_price: float = 0.0
    item_total: float = 0.0
    product: Optional[ProductResponse] = None

    model_config = ConfigDict(from_attributes=True)


class CartResponse(BaseModel):
    """Response model for the entire user cart with calculated totals."""
    items: List[CartItemResponse] = Field(default_factory=list)
    total_items: int = 0
    total_amount: float = 0.0
