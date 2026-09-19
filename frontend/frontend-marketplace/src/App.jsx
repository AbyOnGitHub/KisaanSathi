/**
 * Main Application Component with Routing, Layout, Context Providers, Role Route Guards, and Toast Notifications.
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';

import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import BargainList from './pages/BargainList';
import BargainDetail from './pages/BargainDetail';
import SellerDashboard from './pages/seller/SellerDashboard';

// Scroll to top upon navigating to a new route
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route Guard: Only accessible by registered Sellers
const SellerRoute = ({ children }) => {
  const { isSeller, loading } = useAuth();
  if (loading) return null;
  if (!isSeller) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Route Guard: Farmer-only retail actions (Cart & Retail Checkout)
const FarmerRoute = ({ children }) => {
  const { isSeller, loading } = useAuth();
  if (loading) return null;
  if (isSeller) {
    return <Navigate to="/seller/dashboard" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-agri-bg text-agri-text">
            {/* 3-Row Sticky Header */}
            <Header />

            {/* Main Application Body */}
            <main className="flex-1 pb-16 md:pb-0">
              <Routes>
                {/* Public / Common Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/orders/:id/success" element={<OrderSuccess />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/bargains" element={<BargainList />} />
                <Route path="/bargains/:sessionId" element={<BargainDetail />} />

                {/* Farmer Buyer Routes */}
                <Route
                  path="/cart"
                  element={
                    <FarmerRoute>
                      <Cart />
                    </FarmerRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <FarmerRoute>
                      <Checkout />
                    </FarmerRoute>
                  }
                />

                {/* Seller Dashboard Routes */}
                <Route
                  path="/seller/dashboard"
                  element={
                    <SellerRoute>
                      <SellerDashboard />
                    </SellerRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Multi-Column Amazon/Flipkart Footer */}
            <Footer />

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav />

            {/* Global Notification Toast Container */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#1f2937',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: '#16a34a',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#dc2626',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
