/**
 * Order History Page.
 * Amazon-style order cards with shipment status timeline and line items summary.
 * Connected directly to FastAPI GET /orders/.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice, formatDate, getEstimatedDeliveryDate } from '../utils/formatters';
import api from '../utils/api';

export const OrderHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/orders/');
        if (res.data?.data) {
          setOrders(res.data.data);
        } else if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'active') return ['pending', 'confirmed', 'shipped'].includes(o.status);
    if (activeTab === 'delivered') return o.status === 'delivered';
    if (activeTab === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const breadcrumbs = [
    { label: t('footer.marketplace_catalog'), href: '/products' },
    { label: t('nav.my_orders') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 space-y-5">
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Title & Tabs */}
      <div className="bg-white rounded-lg border border-agri-border p-5 space-y-4 shadow-xs">
        <h1 className="text-xl font-black text-gray-900 tracking-tight">{t('orders.history_title')}</h1>

        {/* Status Tabs */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3 text-xs font-bold overflow-x-auto">
          {[
            { id: 'all', label: t('orders.tab_all', { count: orders.length }) },
            { id: 'active', label: t('orders.tab_active') },
            { id: 'delivered', label: t('orders.tab_delivered') },
            { id: 'cancelled', label: t('orders.tab_cancelled') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-agri-primary text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-xs">
          <div className="w-8 h-8 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>{t('common.loading')}</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12 text-gray-400" />}
          title={t('orders.no_orders_title')}
          description={t('orders.no_orders_desc')}
          actionText={t('orders.browse_marketplace')}
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isCancelled = order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-agri-border shadow-xs overflow-hidden text-xs"
              >
                {/* Amazon-style Card Header (Grey Strip) */}
                <div className="bg-gray-50 p-3.5 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-600">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">{t('orders.order_placed')}</span>
                    <span className="font-semibold text-gray-900">{formatDate(order.created_at)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">{t('orders.total_amount')}</span>
                    <span className="font-extrabold text-gray-900">{formatPrice(order.total_amount)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">{t('orders.ship_to')}</span>
                    <span className="font-semibold text-gray-900 truncate block">
                      {order.shipping_city}, {order.shipping_state}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">{t('orders.order_num')}</span>
                    <span className="font-mono font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
                  </div>
                </div>

                {/* Status Bar & Timeline */}
                <div className="p-4 border-b border-gray-100 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Truck className={`w-4 h-4 ${isDelivered ? 'text-green-600' : isCancelled ? 'text-red-500' : 'text-agri-accent'}`} />
                        <span className="font-extrabold text-sm text-gray-900 uppercase">
                          {t('orders.status', { status: order.status })}
                        </span>
                      </div>

                      {/* Payment Status Badge */}
                      <span
                        className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : order.payment_status === 'failed'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {order.payment_status === 'paid'
                          ? `✓ ${t('orders.payment_paid') || 'Paid'}`
                          : order.payment_status === 'failed'
                          ? `✕ ${t('orders.payment_failed') || 'Failed'}`
                          : `⏳ ${t('orders.payment_pending') || 'Pending'}`}
                      </span>
                    </div>

                    <span className="text-gray-500 text-[11px]">
                      {isDelivered ? t('orders.delivered_msg') : t('orders.expected_delivery', { date: getEstimatedDeliveryDate(3) })}
                    </span>
                  </div>

                  {/* Horizontal Timeline */}
                  {!isCancelled && (
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 pt-1">
                      <div className="flex items-center gap-1 text-agri-primary">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('orders.timeline_ordered')}</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'bg-agri-primary' : 'bg-gray-200'}`} />
                      <div className={`flex items-center gap-1 ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'text-agri-primary' : 'text-gray-400'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('orders.timeline_confirmed')}</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${['shipped', 'delivered'].includes(order.status) ? 'bg-agri-primary' : 'bg-gray-200'}`} />
                      <div className={`flex items-center gap-1 ${['shipped', 'delivered'].includes(order.status) ? 'text-agri-primary' : 'text-gray-400'}`}>
                        <Truck className="w-3.5 h-3.5" />
                        <span>{t('orders.timeline_shipped')}</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${order.status === 'delivered' ? 'bg-agri-primary' : 'bg-gray-200'}`} />
                      <div className={`flex items-center gap-1 ${order.status === 'delivered' ? 'text-agri-primary font-bold' : 'text-gray-400'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('orders.timeline_delivered')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List Inside Order */}
                <div className="p-4 divide-y divide-gray-100">
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product?.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=100&auto=format&fit=crop&q=80'}
                          alt={it.product?.name}
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                        <div>
                          <Link
                            to={`/products/${it.product_id}`}
                            className="font-bold text-gray-900 hover:text-agri-primary truncate block"
                          >
                            {it.product?.name || 'Agri Supply Item'}
                          </Link>
                          <span className="text-[11px] text-gray-500">
                            {t('cart.qty')} <strong>{it.quantity}</strong> × {formatPrice(it.price_at_purchase)}
                          </span>
                        </div>
                      </div>

                      <Link to={`/products/${it.product_id}`}>
                        <Button variant="outline" size="sm">
                          {t('orders.buy_again')}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
