"""
Bargain & Negotiation Pydantic models.
"""

from typing import Optional, List, Any, Literal
from pydantic import BaseModel, Field, ConfigDict
from app.models.product import ProductResponse, SellerBasicInfo


class BargainStartRequest(BaseModel):
    """Payload for a farmer to initiate a new price negotiation session."""
    product_id: Any = Field(..., description="ID of the product to bargain on")
    offered_price: float = Field(..., gt=0, description="Farmer's initial proposed price per unit")
    quantity: int = Field(1, gt=0, description="Intended quantity to buy")
    message: Optional[str] = Field(None, max_length=500, description="Optional note for the seller")


class BargainOfferRequest(BaseModel):
    """Payload for submitting a counter-offer in an active bargain session."""
    session_id: Any = Field(..., description="ID of the bargain session")
    offered_price: float = Field(..., gt=0, description="Counter-offered price per unit")
    quantity: Optional[int] = Field(None, gt=0, description="Quantity for this offer (optional)")
    message: Optional[str] = Field(None, max_length=500, description="Optional message")


class BargainOfferResponse(BaseModel):
    """Response model for an individual offer in a session."""
    id: Any
    session_id: Any
    offered_by: Literal["farmer", "seller"]
    offered_price: float
    quantity: int = 1
    message: Optional[str] = None
    created_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class BargainSessionResponse(BaseModel):
    """Full response model for a bargain negotiation session."""
    id: Any
    product_id: Any
    farmer_id: Any
    seller_id: Any
    original_price: float
    status: Literal["open", "accepted", "rejected", "expired", "cancelled"]
    settled_price: Optional[float] = None
    settled_at: Optional[str] = None
    expires_at: Optional[str] = None
    created_at: Optional[str] = None

    # Nested related details
    product: Optional[ProductResponse] = None
    farmer: Optional[SellerBasicInfo] = None
    seller: Optional[SellerBasicInfo] = None
    offers: List[BargainOfferResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
