# KisaanSathi (किसान साथी) — Farmer Portal

KisaanSathi is a farmer portal designed to assist farmers with predictive tools, agricultural guidance, plant health management, and market intelligence.

This repository currently features the **Crop Yield Prediction** module, powered by a machine learning regression model, integrated with a FastAPI backend and a responsive, farmer-friendly React frontend.

---

## Project Structure

```
KisaanSathi/
│
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entry point & CORS
│   │   ├── config.py                   # Environment configuration & relative paths
│   │   ├── routers/
│   │   │   ├── health.py               # GET /api/health
│   │   │   └── crop_yield.py           # POST /api/crop-yield/predict
│   │   ├── services/
│   │   │   └── crop_yield_predictor.py # Model loader & inference singleton
│   │   └── schemas/
│   │       └── crop_yield.py           # Pydantic request/response validation
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # KisaanSathi portal navigation
│   │   │   ├── Footer.jsx              # Farmer portal footer
│   │   │   ├── Home.jsx                # Overview of services
│   │   │   ├── PlaceholderFeature.jsx  # Placeholders for upcoming features
│   │   │   └── CropYield/
│   │   │       ├── CropYieldPage.jsx   # Dedicated yield prediction view
│   │   │       ├── YieldForm.jsx       # Input form with validation & sample loader
│   │   │       ├── YieldResult.jsx     # Result card with Q/acre & disclaimer
│   │   │       └── InfoCard.jsx        # Farming insights & nutrient guide
│   │   ├── services/
│   │   │   └── api.js                  # Frontend-to-FastAPI client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── models/
    ├── dataset.csv                     # Cleaned agricultural dataset (99 usable rows)
    ├── Crop_Yield_Prediction.ipynb     # Model experimentation, evaluation & saving
    └── crop_yield_model.pkl            # Trained Gradient Boosting pipeline
```

---

## Machine Learning Model Details

- **Problem Type**: Regression
- **Target Variable**: `Yeild (Q/acre)` (quintals per acre)
- **Input Features**:
  1. `Rain Fall (mm)`
  2. `Fertilizer`
  3. `Temperatue` (°C)
  4. `Nitrogen (N)`
  5. `Phosphorus (P)`
  6. `Potassium (K)`
- **Selected Model**: `GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, max_depth=2, loss="huber", random_state=42)` with `SimpleImputer(strategy="median")`.
- **Evaluation Baseline (5-Fold Cross-Validation)**:
  - Mean R² score = `0.8741` (R² score of `87.41%`)
  - Mean MAE = `0.4864 Q/acre`
  - Mean RMSE = `0.6436 Q/acre`

---

## Getting Started

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (with npm)

---

### Step 1: Backend Setup (FastAPI)

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
4. Verify backend is running:
   - Visit http://127.0.0.1:8000/api/health -> `{"status": "ok"}`
   - API Docs: http://127.0.0.1:8000/docs

---

### Step 2: Frontend Setup (React + Vite)

1. Open another terminal in `frontend/`:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
   *(On Windows PowerShell, use `npm.cmd install` if script execution is restricted)*
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   **http://localhost:5173**

---

## API Usage

### Health Check
`GET /api/health`

**Response:**
```json
{
  "status": "ok"
}
```

### Predict Crop Yield
`POST /api/crop-yield/predict`

**Request:**
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

**Response:**
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
