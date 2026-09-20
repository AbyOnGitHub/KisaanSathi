/**
 * Order Success Confirmation Page.
 * Animated checkmark, order ID display, estimated delivery, and tracking links.
 */

import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import Button from '../components/common/Button';
import { formatPrice, getEstimatedDeliveryDate } from '../utils/formatters';

export const OrderSuccess = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order || {
    id: id || 'ord-demo-982',
    total_amount: 3250,
    shipping_city: 'Nagpur',
    shipping_pincode: '440001',
  };

  const deliveryDate = getEstimatedDeliveryDate(3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl border border-agri-border p-8 sm:p-12 shadow-md space-y-6">
        {/* Animated Green Checkmark */}
        <div className="w-20 h-20 bg-green-100 text-agri-primary rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {t('orders.success_title')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('orders.success_sub')}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-left text-xs max-w-md mx-auto space-y-3">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">{t('orders.order_id')}</span>
            <span className="font-mono font-bold text-gray-900">#{order.id.slice(0, 10)}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">{t('orders.total_amount')}</span>
            <span className="font-extrabold text-agri-primary text-sm">
              {formatPrice(order.total_amount)}
            </span>
          </div>

          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">{t('orders.payment_status_label') || 'Payment Status:'}</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase ${
                order.payment_status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : order.payment_status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.payment_status === 'paid'
                ? t('orders.payment_paid')
                : order.payment_status === 'failed'
                ? t('orders.payment_failed')
                : t('orders.payment_pending')}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 text-gray-700">
            <Truck className="w-4 h-4 text-agri-primary flex-shrink-0" />
            <span>
              {t('common.free_delivery_by', { date: deliveryDate })}
            </span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/orders">
            <Button variant="primary" size="md" leftIcon={<Package className="w-4 h-4" />}>
              {t('orders.view_all_orders_btn')}
            </Button>
          </Link>

          <Link to="/products">
            <Button variant="secondary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              {t('orders.continue_shopping_btn')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
