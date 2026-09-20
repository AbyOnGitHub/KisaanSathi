# Frontend Login System (`frontend-loginsystem`)

This folder contains all frontend components and configuration for the **KisaanSathi Authentication & Role Selection System**.

---

## Folder Structure

```
frontend/frontend-loginsystem/
├── public/                 # Static assets (favicons, icons)
├── src/                    # Running application source code
│   ├── components/         # ProtectedRoute.jsx
│   ├── pages/              # RoleSelect.jsx, Login.jsx, Signup.jsx
│   ├── App.jsx             # Main router
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind styles
├── frontend_auth/          # Standalone portable auth modules
│   ├── RoleSelect.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ProtectedRoute.jsx
│   └── supabase.js
├── index.html              # HTML entry page
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite build config
├── tailwind.config.js      # Tailwind CSS config
└── README.md
```

---

## How to Run the Frontend

```bash
cd frontend/frontend-loginsystem
npm install
npm run dev
```

---

## Features

1. **Pre-Login Role Selection (`RoleSelect.jsx`)**:
   - Initial entry point at `/` and `/select-role`.
   - Allows users to select **Farmer**, **Raw Material Dealer (Seller)**, or **Admin**.
   - Preserves role selection across pages and Google OAuth.

2. **Google OAuth with Role Preservation (`Login.jsx`, `Signup.jsx`)**:
   - Integrates with Supabase Google OAuth (`supabase.auth.signInWithOAuth`).
   - Automatically assigns the selected role upon Google sign-in.

3. **Dual Verification on Sign-Up (`Signup.jsx`)**:
   - **Email Link**: Sends confirmation link to the user's Gmail.
   - **SMS OTP**: Supports 6-digit phone verification (with demo sandbox fallback).

4. **1-Click Developer Demo Login (`Login.jsx`)**:
   - Allows immediate presentation/viva testing without waiting for verification emails.
   - Click **"Use Sample Farmer Demo Login"** (`demo.farmer@kisaansathi.org`) for instant access to the portal.

---

## Setup for Teammates

### 1. Environment Variables
Create `.env` in `frontend/frontend-loginsystem/.env`:
```env
VITE_SUPABASE_URL=https://pxzikfwejlncbwcrsujv.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Running Locally
```bash
cd frontend/frontend-loginsystem
npm install
npm run dev
```

import RoleSelect from './frontend-loginsystem/frontend_auth/RoleSelect';
import Login from './frontend-loginsystem/frontend_auth/Login';
import Signup from './frontend-loginsystem/frontend_auth/Signup';
import ProtectedRoute from './frontend-loginsystem/frontend_auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/select-role" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Your Protected Feature Route */}
        <Route path="/your-feature" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <YourFeatureComponent />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
```
