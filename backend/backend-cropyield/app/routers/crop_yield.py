import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.crop_yield import (
    CropYieldPredictionRequest,
    CropYieldPredictionResponse,
)
from app.services.crop_yield_predictor import predictor_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/crop-yield", tags=["Crop Yield Prediction"])

@router.post(
    "/predict",
    response_model=CropYieldPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict expected crop yield based on agricultural inputs"
)
def predict_crop_yield(request: CropYieldPredictionRequest):
    """
    Accepts agricultural parameters from the farmer and predicts expected crop yield
    in quintals per acre (Q/acre) using the pre-trained Gradient Boosting regression model.
    """
    try:
        predicted_yield = predictor_service.predict(request)
        return CropYieldPredictionResponse(
            success=True,
            predicted_yield=predicted_yield,
            unit="Q/acre",
            message=f"Based on the provided conditions, the estimated crop yield is approximately {predicted_yield:.2f} quintals per acre.",
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
