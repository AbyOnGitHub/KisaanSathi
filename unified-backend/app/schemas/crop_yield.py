from pydantic import BaseModel, Field, field_validator
from pydantic_core import PydanticCustomError
from typing import Dict, Any, Optional, List

SUPPORTED_CROPS = [
    "Rice",
    "Wheat",
    "Maize",
    "Bajra",
    "Jowar",
    "Cotton",
    "Soybean",
    "Groundnut",
    "Chickpea",
    "Mustard",
]

# Normalization mapping for farmer inputs, common variations and regional names
CROP_ALIASES: Dict[str, str] = {
    "rice": "Rice",
    "rice (paddy)": "Rice",
    "paddy": "Rice",
    "wheat": "Wheat",
    "maize": "Maize",
    "corn": "Maize",
    "bajra": "Bajra",
    "bajra (pearl millet)": "Bajra",
    "pearl millet": "Bajra",
    "jowar": "Jowar",
    "jowar (sorghum)": "Jowar",
    "sorghum": "Jowar",
    "cotton": "Cotton",
    "soybean": "Soybean",
    "soya": "Soybean",
    "groundnut": "Groundnut",
    "peanut": "Groundnut",
    "chickpea": "Chickpea",
    "chickpea (gram)": "Chickpea",
    "gram": "Chickpea",
    "chana": "Chickpea",
    "mustard": "Mustard",
    "sarson": "Mustard",
}

class CropYieldPredictionRequest(BaseModel):
    crop: Optional[str] = Field(
        default=None,
        description="Selected crop name for estimation (e.g. 'Wheat', 'Rice', 'Maize', 'Bajra', 'Jowar', 'Cotton', 'Soybean', 'Groundnut', 'Chickpea', 'Mustard')",
        examples=["Wheat"]
    )
    rainfall: float = Field(
        ...,
        ge=100.0,
        le=3000.0,
        description="Rainfall in millimetres (mm)",
        examples=[1200.0]
    )
    fertilizer: float = Field(
        ...,
        ge=10.0,
        le=300.0,
        description="Fertilizer application in units",
        examples=[80.0]
    )
    temperature: float = Field(
        ...,
        ge=10.0,
        le=55.0,
        description="Temperature in degrees Celsius (°C)",
        examples=[28.0]
    )
    nitrogen: float = Field(
        ...,
        ge=10.0,
        le=200.0,
        description="Soil Nitrogen content (N)",
        examples=[80.0]
    )
    phosphorus: float = Field(
        ...,
        ge=5.0,
        le=100.0,
        description="Soil Phosphorus content (P)",
        examples=[24.0]
    )
    potassium: float = Field(
        ...,
        ge=5.0,
        le=100.0,
        description="Soil Potassium content (K)",
        examples=[20.0]
    )

    @field_validator("crop", mode="before")
    @classmethod
    def validate_crop(cls, v):
        if v is None:
            return None
        v_str = str(v).strip()
        if not v_str:
            return None
        canonical = CROP_ALIASES.get(v_str.lower())
        if canonical is None:
            supported_list = ", ".join(SUPPORTED_CROPS)
            raise PydanticCustomError(
                "value_error",
                f"Unsupported crop '{v_str}'. Genuinely supported crops are: {supported_list}.",
                {"crop": v_str, "supported": supported_list}
            )
        return canonical

    model_config = {
        "json_schema_extra": {
            "example": {
                "crop": "Wheat",
                "rainfall": 1200.0,
                "fertilizer": 80.0,
                "temperature": 28.0,
                "nitrogen": 80.0,
                "phosphorus": 24.0,
                "potassium": 20.0
            }
        }
    }

class CropYieldPredictionResponse(BaseModel):
    success: bool = True
    crop: Optional[str] = Field(
        default=None,
        description="Crop name for which yield is estimated"
    )
    predicted_yield: float = Field(
        ...,
        description="Estimated crop yield in quintals per acre (Q/acre)"
    )
    unit: str = Field(
        default="Q/acre",
        description="Measurement unit of the crop yield"
    )
    message: str = Field(
        default="Estimated crop yield based on the provided conditions.",
        description="Farmer-friendly description of the result"
    )
    inputs: Dict[str, Any] = Field(
        default_factory=dict,
        description="Echo of input parameters used for prediction"
    )
