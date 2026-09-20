import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { FarmerProvider } from './context/FarmerContext';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { ApplicationFormPage } from './pages/ApplicationFormPage';
import { ApplicationReviewPage } from './pages/ApplicationReviewPage';
import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { SellerDashboard, AdminDashboard, PendingVerification } from './pages/RoleDashboards';

function App() {
  return (
    <LanguageProvider>
      <FarmerProvider>
        <BrowserRouter>
          <Routes>
            {/* Pre-login role selection & auth */}
            <Route path="/" element={<RoleSelect />} />
            <Route path="/select-role" element={<RoleSelect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Farmer app (scheme recommendation flow) - protected */}
            <Route path="/home" element={
              <ProtectedRoute allowedRoles={['farmer']}><LandingPage /></ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute allowedRoles={['farmer']}><OnboardingPage /></ProtectedRoute>
            } />
            <Route path="/schemes" element={
              <ProtectedRoute allowedRoles={['farmer']}><SchemesPage /></ProtectedRoute>
            } />
            <Route path="/schemes/:id" element={
              <ProtectedRoute allowedRoles={['farmer']}><SchemeDetailPage /></ProtectedRoute>
            } />
            <Route path="/schemes/:id/apply" element={
              <ProtectedRoute allowedRoles={['farmer']}><ApplicationFormPage /></ProtectedRoute>
            } />
            <Route path="/applications/:id/review" element={
              <ProtectedRoute allowedRoles={['farmer']}><ApplicationReviewPage /></ProtectedRoute>
            } />

            {/* Seller / Admin placeholders */}
            <Route path="/seller" element={
              <ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/pending-verification" element={
              <ProtectedRoute allowedRoles={['seller']}><PendingVerification /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FarmerProvider>
    </LanguageProvider>
  );
}

export default App;
