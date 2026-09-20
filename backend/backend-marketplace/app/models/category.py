"""
Category Pydantic models.
"""

from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class CategoryResponse(BaseModel):
    """Schema for returning category details."""
    id: Any
    name: str
    slug: str
    icon: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
