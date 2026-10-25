"""
Market Price Pydantic models for Mandi data and price comparison.
"""

from typing import Optional, List, Any, Literal
from pydantic import BaseModel, ConfigDict


class MarketPriceItem(BaseModel):
    """Schema for individual market price observation."""
    id: Optional[Any] = None
    commodity: str
    variety: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    market_name: Optional[str] = None
    min_price: float = 0.0
    max_price: float = 0.0
    modal_price: float = 0.0
    arrival_date: Optional[str] = None
    fetched_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MarketPriceResponse(BaseModel):
    """Response wrapper for market price queries."""
    data: Optional[List[MarketPriceItem]] = None
    message: Optional[str] = None
    commodity: Optional[str] = None
    state: Optional[str] = None


class PriceComparisonResponse(BaseModel):
    """Response model for comparing marketplace product price with government Mandi prices."""
    product_id: Any
    product_name: str
    product_price: float
    market_modal_price: Optional[float] = None
    difference_percent: Optional[float] = None
    verdict: Literal["fair", "high", "low", "unknown"]
    commodity: Optional[str] = None
    state: Optional[str] = None
    message: Optional[str] = None
