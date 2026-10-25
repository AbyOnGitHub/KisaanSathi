/**
 * Empty Cart State View with options to browse products or check order status.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Truck, ArrowRight, PackageCheck } from 'lucide-react';

export const EmptyCart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto my-8 space-y-6 font-work-sans">
      {/* Main Empty Cart Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold font-oswald text-gray-900 mb-2">
          {t('cart.cart_empty_title') || 'Your AgriMart cart is empty'}
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          {t('cart.cart_empty_desc') || 'Explore certified seeds, fertilizers, and tools from verified agricultural dealers.'}
        </p>

        {/* Dual Actions: Shop Now + Check Order Status */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('cart.start_shopping_btn') || 'Start Shopping Now'}</span>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-green-700" />
            <span>Check Order Status</span>
          </button>
        </div>
      </div>

      {/* Dedicated Order Status & Tracking Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-green-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-green-200 flex items-center justify-center flex-shrink-0 text-green-700">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Checking status of other products?
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Track live shipment updates, dispatch timelines, and delivery receipts for your placed orders.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="whitespace-nowrap px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs flex-shrink-0"
        >
          <span>Track Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
