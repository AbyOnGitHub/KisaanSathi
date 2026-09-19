/**
 * 3-Row Sticky Header inspired by Amazon India & Flipkart.
 * Connected to live Supabase session and FastAPI endpoints.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  MessageSquareQuote,
  MapPin,
  User,
  Store,
  ChevronDown,
  PhoneCall,
  Languages,
  Menu,
  X,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useBargainSessions } from '../../hooks/useBargainSessions';
import api from '../../utils/api';

export const Header = () => {
  const navigate = useNavigate();
  const { user, profile, isFarmer, isSeller, logout } = useAuth();
  const { totalItems } = useCart();
  const { sessions } = useBargainSessions();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pincode, setPincode] = useState('440001 (Nagpur)');
  const [isEditingPincode, setIsEditingPincode] = useState(false);
  const [tempPincode, setTempPincode] = useState('440001');
  const [lang, setLang] = useState('EN');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active open bargain sessions count
  const activeBargainsCount = (sessions || []).filter((s) => s.status === 'open').length;

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories/');
        if (res.data) setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories in header:', err);
      }
    };
    fetchCats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (tempPincode.trim()) {
      setPincode(`${tempPincode} (Verified)`);
    }
    setIsEditingPincode(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sticky-header">
      {/* ROW 1: Utility Bar (Dark Green) */}
      <div className="bg-[#14532d] text-white text-xs py-1 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Location / Pincode */}
          <div className="flex items-center gap-1.5 text-green-100">
            <MapPin className="w-3.5 h-3.5 text-agri-accent" />
            <span>Deliver to:</span>
            {isEditingPincode ? (
              <form onSubmit={handlePincodeSubmit} className="flex items-center gap-1 ml-1">
                <input
                  type="text"
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value)}
                  className="bg-white text-gray-900 px-1 py-0.5 rounded text-[11px] w-20 outline-none"
                  autoFocus
                />
                <button type="submit" className="text-agri-accent font-bold hover:underline">
                  Save
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingPincode(true)}
                className="font-semibold text-white hover:text-agri-accent hover:underline flex items-center gap-0.5"
              >
                {pincode}
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: Quick Utility Links */}
          <div className="flex items-center gap-4 text-green-100">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="hidden sm:flex items-center gap-1 hover:text-white"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'EN' ? 'English (EN)' : 'हिंदी (HI)'}</span>
            </button>

            {/* Customer Care */}
            <a href="tel:18001234567" className="hidden lg:flex items-center gap-1 hover:text-white">
              <PhoneCall className="w-3.5 h-3.5 text-agri-accent" />
              <span>1800-AGRI-MART</span>
            </a>

            {/* Seller Central Link */}
            {isSeller ? (
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-1 font-semibold text-agri-accent hover:underline bg-green-900/80 px-2 py-0.5 rounded"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Dashboard</span>
              </Link>
            ) : (
              <span className="text-[11px] text-green-200">
                Farmer Direct Portal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: Main Search & Actions Bar (Green Theme) */}
      <div className="bg-agri-primary text-white py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-white p-1 rounded-md shadow-xs group-hover:scale-105 transition">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Agri<span className="text-agri-accent">Mart</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold text-green-200 tracking-wider -mt-1">
                BHARAT KA KRISHI BAZAAR
              </span>
            </div>
          </Link>

          {/* Search Bar (Center) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center">
            <div className="flex w-full rounded-md shadow-xs overflow-hidden bg-white text-gray-900 border-2 border-transparent focus-within:border-agri-accent">
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-100 text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 outline-none cursor-pointer hover:bg-gray-200"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.slug} value={cat.slug || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Search Text Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seeds, fertilizers, pesticides, sprayers, drip pipes..."
                className="flex-1 px-3 py-2 text-sm text-gray-900 outline-none"
              />

              {/* Search Submit Button */}
              <button
                type="submit"
                className="bg-agri-accent hover:bg-amber-600 text-white px-5 py-2 flex items-center justify-center transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-900 font-bold" />
              </button>
            </div>
          </form>

          {/* Right Action Icons & Account */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Bargain Notifications Icon */}
            <Link
              to="/bargains"
              className="flex items-center gap-1.5 text-white hover:text-agri-accent relative p-1 rounded-md transition"
              title="Bargain Negotiations"
            >
              <div className="relative">
                <MessageSquareQuote className="w-6 h-6" />
                {activeBargainsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-agri-accent text-gray-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {activeBargainsCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold leading-tight">
                Bargains
              </span>
            </Link>

            {/* Orders Link */}
            <Link
              to="/orders"
              className="hidden sm:flex flex-col text-left hover:text-agri-accent transition"
            >
              <span className="text-[10px] text-green-200 leading-none">Returns</span>
              <span className="text-xs font-bold leading-tight">& Orders</span>
            </Link>

            {/* Cart Icon with Live Badge (Only for buyer/farmer) */}
            {isFarmer && (
              <Link
                to="/cart"
                className="flex items-center gap-2 hover:text-agri-accent relative p-1 transition"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-agri-hot text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-bold">Cart</span>
              </Link>
            )}

            {/* User Profile / Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1 text-left hover:text-agri-accent transition p-1"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/40">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block">
                  <span className="text-[10px] text-green-200 block leading-none">
                    Hello, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-xs font-bold flex items-center gap-0.5 leading-tight">
                    Account <ChevronDown className="w-3 h-3" />
                  </span>
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {profile?.business_name || profile?.full_name || user?.email || 'AgriMart User'}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 uppercase">
                      {profile?.role || 'Farmer'}
                    </span>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    My Orders
                  </Link>

                  <Link
                    to="/bargains"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquareQuote className="w-4 h-4 text-gray-500" />
                    My Bargains ({activeBargainsCount})
                  </Link>

                  {isSeller && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Store className="w-4 h-4 text-gray-500" />
                      Seller Dashboard
                    </Link>
                  )}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-white hover:text-agri-accent"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small screens) */}
        <form onSubmit={handleSearch} className="mt-2.5 md:hidden">
          <div className="flex w-full rounded-md shadow-xs overflow-hidden bg-white text-gray-900">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seeds, fertilizers, tools..."
              className="flex-1 px-3 py-2 text-xs text-gray-900 outline-none"
            />
            <button
              type="submit"
              className="bg-agri-accent text-white px-3 py-2 flex items-center justify-center"
            >
              <Search className="w-4 h-4 text-gray-900" />
            </button>
          </div>
        </form>
      </div>

      {/* ROW 3: Horizontal Scrollable Category Shortcuts (Light Bar) */}
      <div className="bg-gray-50 border-b border-agri-border text-xs px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-5 whitespace-nowrap text-gray-700 font-medium">
          <Link
            to="/products"
            className="flex items-center gap-1 font-bold text-agri-primary hover:text-agri-dark"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>All Products</span>
          </Link>
          <Link to="/products?category=seeds" className="hover:text-agri-primary hover:underline">
            🌱 Seeds
          </Link>
          <Link to="/products?category=fertilizers" className="hover:text-agri-primary hover:underline">
            🧪 Fertilizers
          </Link>
          <Link to="/products?category=pesticides" className="hover:text-agri-primary hover:underline">
            🛡️ Pesticides & Bio-Controls
          </Link>
          <Link to="/products?category=tools" className="hover:text-agri-primary hover:underline">
            🚜 Tools & Machinery
          </Link>
          <Link to="/products?category=irrigation" className="hover:text-agri-primary hover:underline">
            💧 Drip & Irrigation
          </Link>
          <Link to="/products?sort_by=discount" className="text-agri-hot font-bold hover:underline flex items-center gap-0.5">
            🔥 Deals of the Day
          </Link>
          <Link to="/bargains" className="text-amber-700 font-bold hover:underline flex items-center gap-0.5">
            💬 Bargain Corner
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
