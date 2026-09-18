import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

// Placeholder Pages
const FarmerDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-green-700">Farmer Dashboard</h1><p>Welcome to KisaanSathi! Check schemes, diseases, and market.</p></div>
const SellerDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-blue-700">Seller Dashboard</h1><p>Manage your products and farmer inquiries.</p></div>
const AdminDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1><p>Manage users, schemes, and verify sellers.</p></div>
const PendingVerification = () => <div className="p-8"><h1 className="text-2xl font-bold text-orange-700">Verification Pending</h1><p>Your seller account is under review. Please wait for admin approval.</p></div>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/farmer" element={
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

        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
