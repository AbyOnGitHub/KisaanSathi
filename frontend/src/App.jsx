import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FarmerPortal from './pages/FarmerPortal';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';

// Seller Dashboard with simple logout
const SellerDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Seller Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
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
    window.location.href = '/login';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
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
    window.location.href = '/login';
  };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-700">Verification Pending</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Farmer Portal with Crop Yield Prediction */}
        <Route path="/farmer/*" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerPortal />
          </ProtectedRoute>
        } />

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

        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
