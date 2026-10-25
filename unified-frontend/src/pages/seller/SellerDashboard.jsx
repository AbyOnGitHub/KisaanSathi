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

export const SellerDashboard = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'dashboard', 'products', 'orders', 'bargains'
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingBargains: 0,
    activeProducts: 0,
    revenueThisMonth: 0,
  });

  const fetchSellerStats = async () => {
    try {
      const [ordersRes, bargainsRes, productsRes] = await Promise.allSettled([
        api.get('/orders/seller/received'),
        api.get('/bargain/seller/pending'),
        profile?.id ? api.get(`/products/seller/${profile.id}`) : Promise.resolve({ data: [] }),
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
  }, [profile]);

  const sidebarLinks = [
    { id: 'dashboard', label: t('seller.tab_overview'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: t('seller.tab_my_products'), icon: <Layers className="w-4 h-4" /> },
    { id: 'orders', label: t('seller.tab_received_orders'), icon: <Package className="w-4 h-4" /> },
    { id: 'bargains', label: t('seller.tab_bargain_requests'), icon: <MessageSquareQuote className="w-4 h-4" /> },
  ];

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
              {profile?.business_name || profile?.full_name || 'AgriMart Seller'}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>{t('seller.verified_dealer')}</span>
              {profile?.gstin_or_license && (
                <>
                  <span>•</span>
                  <span>{t('seller.gstin_label', { gstin: profile.gstin_or_license })}</span>
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

