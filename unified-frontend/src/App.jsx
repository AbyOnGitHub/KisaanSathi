import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { FarmerProvider } from './context/FarmerContext';
import { Toaster } from 'react-hot-toast';

// Layout Component
const Layout = ({ children }) => {
  const { user, profile, logout } = useAuth();
  const isSeller = profile?.role === 'seller' || user?.role === 'seller' || user?.user_metadata?.role === 'seller' || user?.email?.includes('seller');
  
  return (
    <div className="min-h-screen flex flex-col font-work-sans">
      <header className="bg-green-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-oswald font-bold tracking-wider">
            <img src="/logo.jpg" alt="Kisan Sathi" className="h-10 w-10 object-contain rounded-full shadow-sm" />
            Kisan Sathi
          </Link>
          <nav className="hidden md:flex space-x-6 font-medium items-center">
            <Link to="/marketplace" className="hover:text-green-200 transition-colors">Marketplace</Link>
            <Link to="/schemes" className="hover:text-green-200 transition-colors">Schemes</Link>
            <Link to="/disease-detection" className="hover:text-green-200 transition-colors">Crop Disease</Link>
            <Link to="/yield-prediction" className="hover:text-green-200 transition-colors">Yield Prediction</Link>
            <Link to="/bargains" className="hover:text-green-200 transition-colors">Bargains</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="hover:text-green-200">🛒</Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={isSeller ? "/seller" : "/dashboard"}
                  className="hover:underline flex items-center gap-1.5"
                  title={isSeller ? "Go to Seller Products Dashboard" : "Go to Farmer Profile"}
                >
                  {isSeller && (
                    <span className="bg-yellow-400 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                      Seller
                    </span>
                  )}
                  <span>{user.full_name || profile?.business_name || user.email}</span>
                </Link>
                <button onClick={logout} className="text-sm bg-green-800 px-3 py-1 rounded hover:bg-green-900 transition-colors">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-green-700 px-4 py-1.5 rounded font-medium hover:bg-green-50 transition-colors">Login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50 text-gray-900">
        {children}
      </main>
      <footer className="bg-gray-900 text-gray-300 py-8 text-center font-work-sans">
        <p>&copy; {new Date().getFullYear()} Kisan Sathi. Empowering Farmers.</p>
      </footer>
    </div>
  );
};


// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const RoleSelect = lazy(() => import('./pages/RoleSelect'));
const FarmerPortal = lazy(() => import('./pages/FarmerPortal'));

const SchemesPage = lazy(() => import('./pages/SchemesPage'));
const SchemeDetailPage = lazy(() => import('./pages/SchemeDetailPage'));

const ProductCatalog = lazy(() => import('./pages/ProductCatalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));

const BargainList = lazy(() => import('./pages/BargainList'));
const BargainDetail = lazy(() => import('./pages/BargainDetail'));

const DiseaseDetection = lazy(() => import('./pages/DiseaseDetection'));
const CropYield = lazy(() => import('./pages/CropYield'));

const ApplicationFormPage = lazy(() => import('./pages/ApplicationFormPage'));
const ApplicationReviewPage = lazy(() => import('./pages/ApplicationReviewPage'));

const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'));
const SellerProducts = lazy(() => import('./pages/seller/SellerProducts'));
const SellerOrders = lazy(() => import('./pages/seller/SellerOrders'));
const SellerBargains = lazy(() => import('./pages/seller/SellerBargains'));

function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<div className="flex items-center justify-center h-full min-h-[50vh]"><div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div></div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/dashboard" element={<FarmerPortal />} />
          
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/schemes/:id" element={<SchemeDetailPage />} />
          <Route path="/schemes/:id/apply" element={<ApplicationFormPage />} />
          <Route path="/applications/:id/review" element={<ApplicationReviewPage />} />
          
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id/success" element={<OrderSuccess />} />
          
          <Route path="/bargains" element={<BargainList />} />
          <Route path="/bargains/:id" element={<BargainDetail />} />
          
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/yield-prediction" element={<CropYield />} />

          {/* Seller Routes */}
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/bargains" element={<SellerBargains />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <FarmerProvider>
              <Toaster position="top-right" />
              <AppRoutes />
            </FarmerProvider>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
