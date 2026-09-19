# KisaanSathi Login & Authentication System

This folder preserves the complete **Login & Authentication System** for the KisaanSathi project, built using Supabase Auth, PostgreSQL Row-Level Security (RLS), React Router, and FastAPI.

---

## Architecture Overview

```
LoginSystem/
├── README.md               # Documentation & setup instructions
├── supabase_schema.sql     # Database schema, tables, triggers, and RLS policies
├── frontend_auth/
│   ├── RoleSelect.jsx      # Pre-login Role Selection page (Farmer vs Raw Material Dealer / Seller)
│   ├── Login.jsx           # Role-aware login with Google OAuth & Sample Developer Login
│   ├── Signup.jsx          # Role-aware registration with Email Link & SMS OTP verification options
│   ├── ProtectedRoute.jsx  # Route guard checking Supabase session & role
│   └── supabase.js         # Supabase client configuration
└── backend_auth/
    └── auth.py             # FastAPI HTTPBearer JWT verification dependency
```

---

## Authentication Features

### 1. Pre-Login Role Selection (`RoleSelect.jsx`)
- The portal's entry point (`/` and `/select-role`) asks the user to choose their role before logging in:
  - **Farmer (किसान / शेतकरी)** -> Navigates to `/login?role=farmer`.
  - **Raw Material Dealer / Seller (कृषी विक्रेता)** -> Navigates to `/login?role=seller`.
  - **Administrator Access** -> Navigates to `/login?role=admin`.
- The Login page tailors its theme, badge, credentials, and routing based on this choice.
- Users can click **"← Change Role"** anytime to switch roles.

### 2. Google OAuth Authentication with Role Preservation
- Users can sign in or sign up with their Google Account (`supabase.auth.signInWithOAuth({ provider: 'google' })`).
- **Role Selection Preservation**:
  - The chosen role is safely stored in `localStorage` before initiating OAuth redirection.
  - When returning from Google OAuth, the user's profile is automatically created/verified with the selected role.
  - This ensures Google OAuth strictly respects whether the user selected Farmer or Dealer.
- To enable in Supabase:
  1. Go to **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**.
  2. Toggle **Enable Google provider**.
  3. Enter Google Client ID and Google Client Secret from Google Cloud Console.
  4. Add redirect URL: `<project-url>/auth/v1/callback` and `http://localhost:5173/login`.

### 3. Dual Verification Options During Sign-up
- **Email Verification (Gmail)**:
  - Default recommended option.
  - Sends a secure verification link to the user's Gmail/email.
  - User clicks the link to confirm their email before logging in.
- **Phone / SMS OTP Verification**:
  - User receives a 6-digit one-time password (OTP) via SMS on their phone.
  - User enters OTP to verify and immediately activate their account.
  - Fallback/demo mode supports sandbox OTPs (`123456`) and developer bypass.

### 4. Developer & Demonstration Sample Login
- On the Login page:
  - **"Fill Sample Data"**: 1-click auto-fills sample credentials tailored to the selected role:
    - Farmer: `demo.farmer@kisaansathi.org` / `DemoFarmer@2025`
    - Dealer: `demo.seller@kisaansathi.org` / `DemoSeller@2025`
    - Admin: `demo.admin@kisaansathi.org` / `DemoAdmin@2025`
  - **"1-Click Demo"**: Instant bypass directly to the respective portal (`/crop-yield` for farmers, `/seller` for dealers, `/admin` for administrators) for zero-latency viva and project demonstrations.

---

## Roles Supported

1. **Farmer**:
   - Access to the Multilingual Crop Yield Prediction module (English, Hindi, Marathi).
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
