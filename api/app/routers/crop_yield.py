import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.crop_yield import (
    CropYieldPredictionRequest,
    CropYieldPredictionResponse,
    SUPPORTED_CROPS,
)
from app.services.crop_yield_predictor import predictor_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Crop Yield Prediction"])

@router.get(
    "/api/crop-yield/crops",
    summary="Get list of supported crops for yield estimation"
)
@router.get(
    "/crop-yield/crops",
    summary="Get list of supported crops for yield estimation"
)
def get_supported_crops():
    """Returns list of crops genuinely supported by the crop-aware prediction model."""
    return {
        "success": True,
        "crops": SUPPORTED_CROPS,
        "count": len(SUPPORTED_CROPS)
    }

@router.post(
    "/api/crop-yield/predict",
    response_model=CropYieldPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict expected crop yield based on agricultural inputs"
)
@router.post(
    "/crop-yield/predict",
    response_model=CropYieldPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict expected crop yield based on agricultural inputs"
)
def predict_crop_yield(request: CropYieldPredictionRequest):
    """
    Accepts agricultural parameters and selected crop identity from the farmer and predicts
    expected crop yield in quintals per acre (Q/acre) using the crop-aware Gradient Boosting pipeline.
    """
    try:
        predicted_yield = predictor_service.predict(request)
        if request.crop:
            msg = f"Based on the provided conditions, the estimated yield for {request.crop} is approximately {predicted_yield:.2f} quintals per acre."
        else:
            msg = f"Based on the provided conditions, the estimated crop yield is approximately {predicted_yield:.2f} quintals per acre."

        return CropYieldPredictionResponse(
            success=True,
            crop=request.crop,
            predicted_yield=predicted_yield,
            unit="Q/acre",
            message=msg,
            inputs=request.model_dump()
        )
    except FileNotFoundError as e:
        logger.error(f"Model file not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Crop yield prediction model is currently unavailable on the server. Please contact support."
        )
    except Exception as e:
        logger.error(f"Error during crop yield prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while calculating the yield estimate. Please check the inputs and try again."
        )
