# KisaanSathi — Vercel Monorepo Deployment Guide

This project is configured as a **100% Vercel Monorepo**. Both the **React 19 Frontend** and the **FastAPI Python Backend** run together on Vercel without requiring external platforms like Render, Railway, or Hugging Face Spaces.

---

## Architecture Overview

```
KisaanSathi/
├── api/
│   ├── index.py              # Vercel Python Serverless Function entrypoint (FastAPI)
│   └── requirements.txt      # Optimized serverless Python dependencies (LiteRT/TFLite)
├── unified-frontend/         # React 19 + Vite Frontend SPA
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── unified-backend/          # FastAPI application codebase & ML models
│   ├── app/
│   │   ├── routers/          # Marketplace, Disease, Yield, Schemes, Auth
│   │   └── services/         # Model predictors with resilient serverless fallbacks
│   └── models/               # Model weights (.tflite, .pkl)
├── package.json              # Monorepo root workspace configuration
├── vercel.json               # Vercel build settings, SPA fallback, & /api rewrites
└── .vercelignore             # Keeps deployment payload lightweight
```

- **Domain Unification**: Every request to `https://your-domain.vercel.app/api/*` is routed to the Python Serverless Function (`api/index.py`).
- **Single Page Application**: All UI routes (e.g., `/marketplace`, `/disease-detection`, `/crop-yield`, `/schemes`) are served by Vite from `unified-frontend/dist`.
- **Zero CORS Configuration**: Because both the UI and the API live on the exact same domain, there are no cross-origin errors in production.

---

## Deployment Steps

### Option A: Deploy via Vercel Web Dashboard (Recommended)

1. Push your latest code to GitHub:
   ```bash
   git add .
   git commit -m "Configure 100% Vercel monorepo deployment"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your **`KisaanSathi`** repository.
5. In the **Configure Project** screen:
   - **Framework Preset**: Select **Vite** (or leave as Other / auto-detected).
   - **Root Directory**: Leave as `./` (Root directory).
   - **Build and Output Settings**: Defaults from `vercel.json` will automatically be detected:
     - Build Command: `npm --prefix unified-frontend run build`
     - Output Directory: `unified-frontend/dist`
6. Expand **Environment Variables** and add the following keys:

| Variable Name | Description | Example / Location |
|---|---|---|
| `SUPABASE_URL` | Supabase Project URL | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Anon Public Key | From Supabase API Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret Key | From Supabase API Settings |
| `VITE_SUPABASE_URL` | Frontend Supabase URL | Same as `SUPABASE_URL` |
| `VITE_SUPABASE_ANON_KEY` | Frontend Supabase Anon Key | Same as `SUPABASE_ANON_KEY` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_ID` | Backend Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Backend Razorpay Secret | From Razorpay Dashboard |
| `PAYMENT_MODE` | Payment processing mode | `testing` |

7. Click **Deploy**. Vercel will install dependencies, compile the React 19 frontend into static assets, and package the Python FastAPI function.

---

### Option B: Deploy via Vercel CLI

If you have the Vercel CLI installed:

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy to production
vercel --prod
```

When prompted, accept the default root directory `./`.

---

## Verifying Deployment

Once deployment completes:
1. **Frontend**: Open `https://<your-project>.vercel.app` and test page navigation (`/marketplace`, `/schemes`, `/crop-yield`, `/disease-detection`).
2. **Health Check**: Open `https://<your-project>.vercel.app/api/health` — it should return `{"status": "ok"}`.
3. **Interactive API Docs**: Open `https://<your-project>.vercel.app/docs` to view Swagger UI.
4. **Crop Yield Prediction**: Submit values on `/crop-yield` — verify instant prediction response.
5. **Disease Detection**: Upload a crop leaf image on `/disease-detection` — verify inference response.
