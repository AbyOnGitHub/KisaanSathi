# KisaanSathi Backend

FastAPI backend service for the **KisaanSathi** Farmer Portal, serving the machine learning model for **Crop Yield Prediction**.

## Features

- **Crop Yield Inference**: Serves the trained Gradient Boosting Regressor pipeline (`crop_yield_model.pkl`) with median imputation.
- **Input Validation**: Validates agricultural parameters with domain ranges using Pydantic.
- **Singleton Model Loading**: Model is loaded once on startup into memory.
- **Farmer-Friendly Responses**: Clean, human-readable error messages and rounded yield estimates.
- **CORS Enabled**: Configured for local frontend development.

---

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py        # /api/health endpoint
│   │   └── crop_yield.py    # /api/crop-yield/predict endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   └── crop_yield_predictor.py  # Model inference service
│   └── schemas/
│       ├── __init__.py
│       └── crop_yield.py    # Request & response Pydantic models
├── requirements.txt
├── .env.example
└── README.md
```

---

## Installation & Setup

### 1. Install Dependencies

Ensure Python 3.10+ is installed. In the `backend/` directory:

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default settings:
- `HOST=127.0.0.1`
- `PORT=8000`
- `FRONTEND_ORIGIN=http://localhost:5173`
- `MODEL_PATH=../models/crop_yield_model.pkl`

### 3. Start the FastAPI Server

From the `backend/` directory, run:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Interactive API documentation will be available at:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

---

## API Endpoints

### 1. Health Check

- **URL**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok"
}
```

### 2. Crop Yield Prediction

- **URL**: `POST /api/crop-yield/predict`
- **Request Body**:
```json
{
  "rainfall": 1200.0,
  "fertilizer": 80.0,
  "temperature": 28.0,
  "nitrogen": 80.0,
  "phosphorus": 24.0,
  "potassium": 20.0
}
```

- **Response Body**:
```json
{
  "success": true,
  "predicted_yield": 12.0,
  "unit": "Q/acre",
  "message": "Based on the provided conditions, the estimated crop yield is approximately 12.00 quintals per acre.",
  "inputs": {
    "rainfall": 1200.0,
    "fertilizer": 80.0,
    "temperature": 28.0,
    "nitrogen": 80.0,
    "phosphorus": 24.0,
    "potassium": 20.0
  }
}
```
