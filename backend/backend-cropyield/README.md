# Crop Yield Prediction Backend (`backend-cropyield`)

This module provides the machine learning inference API for predicting crop harvest yield (in quintals/acre) based on localized agricultural conditions.

---

## Features
- **Endpoints**:
  - `POST /api/v1/crop-yield/predict`: Takes rainfall, temperature, fertilizer, nitrogen (N), phosphorus (P), and potassium (K) levels to output expected yield.
  - `GET /api/v1/health`: System health and model availability check.
- **Model**: Trained Scikit-Learn Random Forest Regressor (`models/crop_yield_model.pkl`).

---

## How to Run

```bash
cd backend/backend-cropyield
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API Documentation will be live at `http://localhost:8000/docs`.
