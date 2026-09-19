# KisaanSathi Frontend

Farmer-friendly web portal built for **KisaanSathi (किसान साथी)** using React, Tailwind CSS, and Vite.

## Features

- **Authentication & Role-Based Dashboards**: Login, signup, and protected routing for Farmers, Sellers, and Admins powered by Supabase.
- **Farmer-Centric Design**: Large accessible input fields, plain language labels with units, helper hints, and quick "Sample Data" loader.
- **Crop Yield Prediction**: Form connected in real-time to the FastAPI backend Gradient Boosting ML model.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.
- **Farmer Portal Ecosystem**: Navigation bar accommodating upcoming modules:
  - Crop Disease Detection (coming soon)
  - Government Scheme Recommendation (coming soon)
  - Mandi Price Negotiator (coming soon)
- **Graceful Error Handling**: Clear feedback for network or validation errors.

---

## Setup & Running

### 1. Install Dependencies

Ensure Node.js v18+ is installed. In the `frontend/` directory:

```bash
npm install
```

*(On Windows PowerShell, use `npm.cmd install` if script execution is restricted)*

### 2. Start Development Server

```bash
npm run dev
```

The portal will be running at:
**http://localhost:5173**

Vite is configured with a proxy to forward all `/api` requests to `http://127.0.0.1:8000`.

### 3. Build for Production

```bash
npm run build
```

The compiled assets will be placed in the `dist/` directory.
