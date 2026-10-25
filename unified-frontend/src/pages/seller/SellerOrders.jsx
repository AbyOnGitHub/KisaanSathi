/**
 * Seller Orders Management Tab.
 * Lists orders containing products from this seller with status progression dropdowns.
 * Connected directly to FastAPI GET /orders/seller/received.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import SellerOrderRow from '../../components/seller/SellerOrderRow';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice } from '../../utils/formatters';
import api from '../../utils/api';

export const SellerOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchSellerOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/seller/received');
      if (res.data?.data) {
        setOrders(res.data.data);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-agri-border p-5 space-y-4 shadow-xs text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900 flex items-center gap-1.5">
            <Package className="w-5 h-5 text-agri-primary" />
            <span>{t('seller.received_orders_title')}</span>
          </h2>
          <p className="text-xs text-gray-500">
            {t('seller.received_orders_sub')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-8 h-8 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>{t('seller.loading_orders')}</span>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-12 h-12 text-gray-400" />}
          title={t('seller.no_orders_title')}
          description={t('seller.no_orders_desc')}
        />
      ) : (
        /* Orders Table */
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('seller.col_order_id')}</th>
                <th className="py-3 px-4">{t('seller.col_date')}</th>
                <th className="py-3 px-4">{t('seller.col_destination')}</th>
                <th className="py-3 px-4">{t('seller.col_items')}</th>
                <th className="py-3 px-4">{t('seller.col_amount')}</th>
                <th className="py-3 px-4">{t('orders.payment_status_label') || 'Payment'}</th>
                <th className="py-3 px-4">{t('seller.col_fulfillment')}</th>
                <th className="py-3 px-4 text-right">{t('seller.col_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map((order) => (
                <SellerOrderRow
                  key={order.id}
                  order={order}
                  onStatusUpdated={fetchSellerOrders}
                  onViewDetails={(ord) => setSelectedOrder(ord)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={t('seller.modal_order_details', { id: selectedOrder.id })}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-bold text-gray-900 block">{t('seller.shipping_address')}</span>
              <p className="text-gray-700">{selectedOrder.shipping_address}</p>
              <p className="text-gray-700">
                {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode}
              </p>
            </div>

            <div>
              <span className="font-bold text-gray-900 block mb-2">{t('seller.ordered_line_items')}</span>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg p-3 space-y-2">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                    <div>
                      <span className="font-bold text-gray-900 block">{it.product?.name}</span>
                      <span className="text-gray-500">
                        {t('seller.qty_label')} {it.quantity} × {formatPrice(it.price_at_purchase)}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatPrice(it.price_at_purchase * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-sm border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{t('orders.payment_status_label') || 'Payment:'}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedOrder.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : selectedOrder.payment_status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.payment_status === 'paid'
                    ? t('orders.payment_paid')
                    : selectedOrder.payment_status === 'failed'
                    ? t('orders.payment_failed')
                    : t('orders.payment_pending')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{t('seller.grand_total')}</span>
                <span className="text-agri-primary text-base">{formatPrice(selectedOrder.total_amount)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SellerOrders;

