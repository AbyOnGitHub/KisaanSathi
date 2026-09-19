# Frontend Login System (`frontend-loginsystem`)

This folder contains all frontend components and configuration for the **KisaanSathi Authentication & Role Selection System**.

---

## Folder Structure

```
frontend/frontend-loginsystem/
├── README.md               # Frontend integration documentation
└── frontend_auth/
    ├── RoleSelect.jsx      # Pre-login Role Selection (Farmer vs Dealer / Seller vs Admin)
    ├── Login.jsx           # Role-aware Login with Google OAuth & 1-Click Developer Demo
    ├── Signup.jsx          # Role-aware Registration with Email Verification Link & SMS OTP
    ├── ProtectedRoute.jsx  # Route guard checking Supabase session & user role
    └── supabase.js         # Supabase client & Demo Session state management
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
Add your Supabase project keys to `frontend/.env`:
```env
VITE_SUPABASE_URL=https://pxzikfwejlncbwcrsujv.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Required NPM Packages
Ensure the following dependencies are installed in `frontend/`:
```bash
npm install @supabase/supabase-js lucide-react react-router-dom
```

### 3. Using in `App.jsx`
You can import the authentication components directly:
```jsx
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
