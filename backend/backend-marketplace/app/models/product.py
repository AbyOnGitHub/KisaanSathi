"""
Product Pydantic models for request validation and response serialization.
"""

from typing import Optional, List, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.models.category import CategoryResponse


class SellerBasicInfo(BaseModel):
    """Schema for basic seller info embedded in product responses."""
    id: Any
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    is_verified: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    """Base fields shared by product create and update models."""
    name: str = Field(..., min_length=2, max_length=255, description="Name of the product")
    description: Optional[str] = Field(None, description="Detailed product description")
    price: float = Field(..., gt=0, description="Original price per unit (must be greater than 0)")
    discount_percent: float = Field(0.0, ge=0.0, le=100.0, description="Discount percentage between 0 and 100")
    unit: str = Field("kg", description="Unit of measurement, e.g. kg, liter, bag, packet, piece")
    stock: int = Field(0, ge=0, description="Available inventory count")
    min_order: int = Field(1, ge=1, description="Minimum order quantity")
    image_urls: List[str] = Field(default_factory=list, description="List of product image URLs")
    tags: List[str] = Field(default_factory=list, description="Searchable tags e.g. ['organic', 'hybrid']")
    allow_bargaining: bool = Field(True, description="Whether farmers can negotiate/bargain price for this item")


class ProductCreate(ProductBase):
    """Request payload for creating a new product."""
    category_id: Any = Field(..., description="ID of the category")


class ProductUpdate(BaseModel):
    """Request payload for updating an existing product."""
    category_id: Optional[Any] = None
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    discount_percent: Optional[float] = Field(None, ge=0.0, le=100.0)
    unit: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    min_order: Optional[int] = Field(None, ge=1)
    image_urls: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None
    allow_bargaining: Optional[bool] = None


class ProductResponse(BaseModel):
    """Response model for a product with full details."""
    id: Any
    seller_id: Any
    category_id: Any
    name: str
    description: Optional[str] = None
    price: float
    discount_percent: float = 0.0
    unit: str
    stock: int
    min_order: int = 1
    rating: float = 0.0
    total_reviews: int = 0
    image_urls: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    is_active: bool = True
    allow_bargaining: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    # Nested related details
    seller: Optional[SellerBasicInfo] = None
    category: Optional[CategoryResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    """Paginated product list response."""
    data: List[ProductResponse]
    page: int
    limit: int
    total: int
