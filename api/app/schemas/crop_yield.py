from pydantic import BaseModel, Field
from typing import Dict, Any

class CropYieldPredictionRequest(BaseModel):
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

    model_config = {
        "json_schema_extra": {
            "example": {
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
