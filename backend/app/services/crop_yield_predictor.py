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
    """
    Service to load pre-trained Crop Yield Prediction models and perform inference.
    Supports genuine crop-wise prediction when a crop is specified, and seamlessly
    maintains backward compatibility with the generic model.
    """
    _instance: Optional["CropYieldPredictor"] = None
    _cropwise_model = None
    _legacy_model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CropYieldPredictor, cls).__new__(cls)
        return cls._instance

    def _resolve_model_path(self, filename: str) -> Optional[Path]:
        """Searches candidate locations for a given model filename."""
        candidate_paths = [
            Path(settings.MODEL_PATH).parent / filename,
            Path(__file__).resolve().parent.parent.parent.parent / "models" / filename,
            Path(__file__).resolve().parent.parent.parent / "models" / filename,
            Path(f"models/{filename}"),
            Path(f"../models/{filename}"),
        ]
        for path in candidate_paths:
            if path.exists() and path.is_file():
                return path
        return None

    def load_model(self) -> None:
        """Loads both crop-aware and legacy models once on startup."""
        # 1. Load crop-aware model pipeline
        if self._cropwise_model is None:
            cropwise_path = self._resolve_model_path("crop_yield_model_cropwise.pkl")
            if cropwise_path:
                try:
                    logger.info(f"Loading Crop-Wise Yield model from: {cropwise_path}")
                    self._cropwise_model = joblib.load(cropwise_path)
                    logger.info("Crop-Wise Yield model loaded successfully.")
                except Exception as e:
                    logger.warning(f"Could not load crop-wise model from {cropwise_path}: {e}")

        # 2. Load legacy model pipeline
        if self._legacy_model is None:
            legacy_path = self._resolve_model_path("crop_yield_model.pkl")
            if legacy_path:
                try:
                    logger.info(f"Loading legacy Crop Yield model from: {legacy_path}")
                    self._legacy_model = joblib.load(legacy_path)
                    logger.info("Legacy Crop Yield model loaded successfully.")
                except Exception as e:
                    logger.warning(f"Could not load legacy model from {legacy_path}: {e}")

        if self._cropwise_model is None and self._legacy_model is None:
            raise FileNotFoundError(
                "Neither 'crop_yield_model_cropwise.pkl' nor 'crop_yield_model.pkl' could be located."
            )

    def predict(self, request: CropYieldPredictionRequest) -> float:
        """
        Predicts crop yield in Q/acre.
        If request.crop is provided, uses the crop-aware model for genuine crop-specific estimation.
        Otherwise falls back to the legacy model to preserve existing behavior.
        """
        if self._cropwise_model is None and self._legacy_model is None:
            self.load_model()

        # Branch 1: Crop-specific estimation requested
        if request.crop and self._cropwise_model is not None:
            input_data = {
                "Crop": [str(request.crop)],
                "Rain Fall (mm)": [float(request.rainfall)],
                "Fertilizer": [float(request.fertilizer)],
                "Temperatue": [float(request.temperature)],
                "Nitrogen (N)": [float(request.nitrogen)],
                "Phosphorus (P)": [float(request.phosphorus)],
                "Potassium (K)": [float(request.potassium)],
            }
            df = pd.DataFrame(input_data)
            try:
                raw_pred = self._cropwise_model.predict(df)[0]
                return round(max(0.0, float(raw_pred)), 2)
            except Exception as e:
                logger.error(f"Crop-wise prediction failed: {e}")
                raise RuntimeError(f"Crop-wise prediction error: {str(e)}")

        # Branch 2: Legacy fallback when no crop is provided
        if self._legacy_model is not None:
            input_data = {
                "Rain Fall (mm)": [float(request.rainfall)],
                "Fertilizer": [float(request.fertilizer)],
                "Temperatue": [float(request.temperature)],
                "Nitrogen (N)": [float(request.nitrogen)],
                "Phosphorus (P)": [float(request.phosphorus)],
                "Potassium (K)": [float(request.potassium)],
            }
            df = pd.DataFrame(input_data)
            try:
                raw_pred = self._legacy_model.predict(df)[0]
                return round(max(0.0, float(raw_pred)), 2)
            except Exception as e:
                logger.error(f"Legacy model prediction failed: {e}")
                raise RuntimeError(f"Prediction calculation error: {str(e)}")

        # If legacy model is missing but cropwise is available, use default crop
        if self._cropwise_model is not None:
            input_data = {
                "Crop": ["Wheat"],
                "Rain Fall (mm)": [float(request.rainfall)],
                "Fertilizer": [float(request.fertilizer)],
                "Temperatue": [float(request.temperature)],
                "Nitrogen (N)": [float(request.nitrogen)],
                "Phosphorus (P)": [float(request.phosphorus)],
                "Potassium (K)": [float(request.potassium)],
            }
            df = pd.DataFrame(input_data)
            raw_pred = self._cropwise_model.predict(df)[0]
            return round(max(0.0, float(raw_pred)), 2)

        raise RuntimeError("No crop yield prediction model is available for inference.")

# Singleton instance
predictor_service = CropYieldPredictor()

