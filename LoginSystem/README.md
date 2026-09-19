# KisaanSathi Login & Authentication System

This folder preserves the complete **Login & Authentication System** for the KisaanSathi project, built using Supabase Auth, PostgreSQL Row-Level Security (RLS), React Router, and FastAPI.

---

## Architecture Overview

```
LoginSystem/
├── README.md               # Documentation & setup instructions
├── supabase_schema.sql     # Database schema, tables, triggers, and RLS policies
├── frontend_auth/
│   ├── Login.jsx           # Login page with role-based redirection
│   ├── Signup.jsx          # Registration with role selection (Farmer, Seller)
│   ├── ProtectedRoute.jsx  # Route guard checking Supabase session & role
│   └── supabase.js         # Supabase client configuration
└── backend_auth/
    └── auth.py             # FastAPI HTTPBearer JWT verification dependency
```

---

## Roles Supported

1. **Farmer**:
   - Has access to the Crop Yield Prediction module and farmer services.
   - Redirects to `/crop-yield` upon successful login.

2. **Seller (Raw Material Dealer)**:
   - Submits business name and GSTIN / trade license during registration.
   - Redirects to `/pending-verification` until verified by an admin, then to `/seller`.

3. **Admin**:
   - Can verify dealers and oversee portal operations.
   - Redirects to `/admin`.

---

## Database Setup (Supabase)

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of `supabase_schema.sql`.
4. In Project Settings > API, copy:
   - **Project URL** -> `VITE_SUPABASE_URL` (frontend) & `SUPABASE_URL` (backend)
   - **Anon Key** -> `VITE_SUPABASE_ANON_KEY` (frontend)
   - **Service Role Key** -> `SUPABASE_SERVICE_ROLE_KEY` (backend)

---

## Environment Configuration

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
