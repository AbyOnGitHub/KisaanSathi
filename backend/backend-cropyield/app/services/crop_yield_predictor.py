import os
import logging
from pathlib import Path
from typing import Optional
import joblib
import pandas as pd
from app.config import settings
from app.schemas.crop_yield import CropYieldPredictionRequest

logger = logging.getLogger(__name__)

class CropYieldPredictor:
    """Service to load the pre-trained Crop Yield Prediction model and perform inference."""
    _instance: Optional["CropYieldPredictor"] = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CropYieldPredictor, cls).__new__(cls)
        return cls._instance

    def load_model(self) -> None:
        """Loads the trained model pipeline from disk once."""
        if self._model is not None:
            return

        candidate_paths = [
            Path(settings.MODEL_PATH),
            Path(__file__).resolve().parent.parent.parent.parent / "models" / "crop_yield_model.pkl",
            Path(__file__).resolve().parent.parent.parent / "models" / "crop_yield_model.pkl",
            Path("models/crop_yield_model.pkl"),
        ]

        model_path = None
        for path in candidate_paths:
            if path.exists() and path.is_file():
                model_path = path
                break

        if model_path is None:
            raise FileNotFoundError(
                f"Trained model file 'crop_yield_model.pkl' could not be found. Checked paths: {[str(p) for p in candidate_paths]}"
            )

        try:
            logger.info(f"Loading Crop Yield model from: {model_path}")
            self._model = joblib.load(model_path)
            logger.info("Crop Yield model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load crop yield model: {e}")
            raise RuntimeError(f"Error loading model from {model_path}: {str(e)}")

    def predict(self, request: CropYieldPredictionRequest) -> float:
        """Predicts the crop yield in Q/acre using the trained Gradient Boosting pipeline."""
        if self._model is None:
            self.load_model()

        # Construct DataFrame matching the exact feature names and order expected by the model
        input_data = {
            "Rain Fall (mm)": [float(request.rainfall)],
            "Fertilizer": [float(request.fertilizer)],
            "Temperatue": [float(request.temperature)],  # original dataset spelling
            "Nitrogen (N)": [float(request.nitrogen)],
            "Phosphorus (P)": [float(request.phosphorus)],
            "Potassium (K)": [float(request.potassium)],
        }
        df = pd.DataFrame(input_data)

        try:
            raw_prediction = self._model.predict(df)[0]
            # Ensure yield is physically sensible (non-negative)
            predicted_yield = max(0.0, float(raw_prediction))
            return round(predicted_yield, 2)
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise RuntimeError(f"Prediction calculation error: {str(e)}")

# Singleton instance
predictor_service = CropYieldPredictor()
