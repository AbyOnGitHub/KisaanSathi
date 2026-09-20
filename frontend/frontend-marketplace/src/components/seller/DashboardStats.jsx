/**
 * Seller Dashboard Metrics & Stats Overview Cards.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, MessageSquareQuote, Layers, TrendingUp, IndianRupee } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const DashboardStats = ({
  totalOrders = 45,
  pendingBargains = 3,
  activeProducts = 28,
  revenueThisMonth = 45800,
}) => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('seller.stat_total_orders'),
      value: totalOrders,
      change: t('seller.stat_vs_last_month'),
      icon: <Package className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      title: t('seller.stat_pending_bargains'),
      value: pendingBargains,
      change: t('seller.stat_requires_counter'),
      badge: pendingBargains > 0 ? t('seller.stat_action_needed') : null,
      icon: <MessageSquareQuote className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      title: t('seller.stat_active_products'),
      value: activeProducts,
      change: t('seller.stat_categories_active'),
      icon: <Layers className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50 border-green-200',
    },
    {
      title: t('seller.stat_revenue'),
      value: formatPrice(revenueThisMonth),
      change: t('seller.stat_growth'),
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((st, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-lg border shadow-xs bg-white flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {st.title}
            </span>
            <div className={`p-2 rounded-lg ${st.bg}`}>{st.icon}</div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">{st.value}</span>
              {st.badge && (
                <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  {st.badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">{st.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

