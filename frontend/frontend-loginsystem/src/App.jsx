import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, ShieldCheck, Building, Store, ArrowRight, LogOut } from 'lucide-react';
import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FarmerPortal from './pages/FarmerPortal';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';

// Farmer Dashboard with all 4 core pillars
const FarmerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/select-role';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <Sprout size={26} className="text-green-800" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">KisaanSathi | किसान साथी</h1>
            <p className="text-xs text-gray-500 mt-1">Farmer Portal Hub (शेतकरी सेवा केंद्र)</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Farmer Services Hub</h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose an agricultural service below to estimate yields, diagnose crops, apply for schemes, or trade in the marketplace.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Crop Yield Prediction (ACTIVE MODULE) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-green-300 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                Ready & Active
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2.5">Crop Yield Prediction</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Estimate expected crop harvest (quintals/acre) using rainfall, temperature, fertilizer, and soil nutrients.
              </p>
            </div>
            <button
              onClick={() => navigate('/crop-yield')}
              className="mt-6 w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Open Predictor</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 2. Crop Disease Detection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                AI Diagnostics
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2.5">Crop Disease Detection</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Scan leaf photos to diagnose diseases and receive instant biological and chemical treatment advisories.
              </p>
            </div>
            <button
              onClick={() => navigate('/crop-disease')}
              className="mt-6 w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Access Module</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 3. Government Schemes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Subsidies & Grants
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2.5">Scheme Recommendation</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Find state and central agricultural welfare schemes, equipment subsidies, and crop insurance coverage.
              </p>
            </div>
            <button
              onClick={() => navigate('/schemes')}
              className="mt-6 w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Schemes</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 4. Agri Marketplace */}
          <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Store size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Commerce
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2.5">Agri Marketplace</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Purchase seeds, fertilizers, and tools directly from verified raw material dealers with bargaining support.
              </p>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Enter Marketplace</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Seller Dashboard with simple logout
const SellerDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/select-role';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-700">Seller Dashboard | विक्रेता पोर्टल</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-700">Manage your raw material products and farmer inquiries.</p>
    </div>
  );
};

// Admin Dashboard with simple logout
const AdminDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/select-role';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard | प्रशासक पोर्टल</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-700">Manage users, schemes, and verify sellers.</p>
    </div>
  );
};

// Pending Verification
const PendingVerification = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/select-role';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-orange-700">Verification Pending</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-700">Your seller account is under review. Please wait for admin approval.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Step 1: Pre-login Role Selection Page */}
        <Route path="/" element={<RoleSelect />} />
        <Route path="/select-role" element={<RoleSelect />} />

        {/* Step 2: Role-aware Login & Signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes for Farmer */}
        <Route path="/farmer" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/farmer/*" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />

        {/* Crop Yield Prediction Route */}
        <Route path="/crop-yield" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerPortal />
          </ProtectedRoute>
        } />
        
        {/* Seller Route */}
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Verification Pending */}
        <Route path="/pending-verification" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <PendingVerification />
          </ProtectedRoute>
        } />

        {/* Fallback route redirects to role selection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
