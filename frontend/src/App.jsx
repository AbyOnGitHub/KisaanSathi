import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';

// Farmer Dashboard with simple logout
const FarmerDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/select-role';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-green-700">Farmer Portal | किसान साथी</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-700">
        Welcome to KisaanSathi! Farmer modules (Crop Yield Prediction, Disease Detection, and Scheme Recommendation) can be plugged in here.
      </p>
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
        
        {/* Protected Routes */}
        <Route path="/farmer/*" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/crop-yield" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

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
