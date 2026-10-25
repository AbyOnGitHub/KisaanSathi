/**
 * Seller Central Dashboard Page.
 * Multi-section dashboard with stats overview, inventory management, orders, and bargain requests.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Layers,
  Package,
  MessageSquareQuote,
  Plus,
  Store,
  CheckCircle2,
} from 'lucide-react';
import DashboardStats from '../../components/seller/DashboardStats';
import SellerProducts from './SellerProducts';
import SellerOrders from './SellerOrders';
import SellerBargains from './SellerBargains';
import Button from '../../components/common/Button';
import ProductFormModal from '../../components/seller/ProductFormModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const SELLER_SEED_DEFAULTS = {
  'seller1@agrimart.in': {
    id: 'a1111111-1111-1111-1111-111111111111',
    business_name: 'Kisan Seva Kendra (Nagpur)',
    full_name: 'Ramesh Patel',
    gstin: '27AABCK1234R1Z5',
  },
  'seller2@agrimart.in': {
    id: 'a2222222-2222-2222-2222-222222222222',
    business_name: 'GreenGrow Agri Depot (Indore)',
    full_name: 'Suresh Agrawal',
    gstin: '23AABCS5678R1Z2',
  },
  'seller3@agrimart.in': {
    id: 'a3333333-3333-3333-3333-333333333333',
    business_name: 'Punjab Crop Solutions (Ludhiana)',
    full_name: 'Gurpreet Singh',
    gstin: '03AABCP9012R1Z8',
  },
};

export const SellerDashboard = () => {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'dashboard', 'products', 'orders', 'bargains'
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingBargains: 0,
    activeProducts: 0,
    revenueThisMonth: 0,
  });

  const matchedSeller = user?.email ? SELLER_SEED_DEFAULTS[user.email] : SELLER_SEED_DEFAULTS['seller2@agrimart.in'];

  const fetchSellerStats = async () => {
    const sellerId = profile?.id || user?.id || matchedSeller?.id || 'a2222222-2222-2222-2222-222222222222';
    try {
      const [ordersRes, bargainsRes, productsRes] = await Promise.allSettled([
        api.get('/orders/seller/received'),
        api.get('/bargain/seller/pending'),
        sellerId ? api.get(`/products/seller/${sellerId}`) : Promise.resolve({ data: [] }),
      ]);

      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data?.data || [] : [];
      const bargains = bargainsRes.status === 'fulfilled' ? bargainsRes.value.data || [] : [];
      const products = productsRes.status === 'fulfilled' ? (Array.isArray(productsRes.value.data) ? productsRes.value.data : productsRes.value.data?.data || []) : [];

      const revenue = orders.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);

      setStats({
        totalOrders: orders.length,
        pendingBargains: bargains.length,
        activeProducts: products.length,
        revenueThisMonth: revenue,
      });
    } catch (err) {
      console.error('Error fetching dashboard summary stats:', err);
    }
  };

  useEffect(() => {
    fetchSellerStats();
  }, [profile, user]);


  const sidebarLinks = [
    { id: 'dashboard', label: t('seller.tab_overview'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: t('seller.tab_my_products'), icon: <Layers className="w-4 h-4" /> },
    { id: 'orders', label: t('seller.tab_received_orders'), icon: <Package className="w-4 h-4" /> },
    { id: 'bargains', label: t('seller.tab_bargain_requests'), icon: <MessageSquareQuote className="w-4 h-4" /> },
  ];

  const sellerBusinessName = profile?.business_name || matchedSeller?.business_name || profile?.full_name || matchedSeller?.full_name || 'AgriMart Seller';
  const sellerGstin = profile?.gstin_or_license || matchedSeller?.gstin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Top Seller Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-green-950 text-white rounded-xl p-5 mb-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-green-500 text-gray-950 rounded-xl shadow-xs">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
              {t('seller.dashboard_title')}
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">
              {sellerBusinessName}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>{t('seller.verified_dealer')}</span>
              {sellerGstin && (
                <>
                  <span>•</span>
                  <span>{t('seller.gstin_label', { gstin: sellerGstin })}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="accent"
            size="sm"
            onClick={() => setAddProductModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t('seller.add_new_product')}
          </Button>
        </div>
      </div>

      {/* Main Panel Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Nav (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-agri-border p-3 shadow-xs sticky top-24 space-y-1 text-xs">
            {sidebarLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold transition text-left ${
                  activeTab === item.id
                    ? 'bg-green-50 text-agri-primary border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Main Content (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Metrics Cards */}
          <DashboardStats
            totalOrders={stats.totalOrders}
            pendingBargains={stats.pendingBargains}
            activeProducts={stats.activeProducts}
            revenueThisMonth={stats.revenueThisMonth}
          />

          {/* Dynamic Tab Views */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <SellerBargains />
              <SellerOrders />
            </div>
          )}

          {activeTab === 'products' && (
            <SellerProducts
              onOpenAddModal={() => setAddProductModalOpen(true)}
              onProductsChanged={fetchSellerStats}
            />
          )}

          {activeTab === 'orders' && <SellerOrders />}

          {activeTab === 'bargains' && <SellerBargains />}
        </div>
      </div>

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        onSaved={() => {
          fetchSellerStats();
          setActiveTab('products');
        }}
      />
    </div>
  );
};

export default SellerDashboard;

