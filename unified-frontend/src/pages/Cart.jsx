/**
 * Shopping Cart Page.
 * 2-Column layout with bargained savings indicator, instant checkout, and order status tracking.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowLeft, Truck, ArrowRight } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalAmount, clearCart, loading } = useCart();

  const breadcrumbs = [
    { label: t('footer.marketplace_catalog'), href: '/products' },
    { label: t('cart.cart_title') },
  ];

  if (!loading && (!items || items.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <Breadcrumbs items={breadcrumbs} />
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 space-y-4">
      <Breadcrumbs items={breadcrumbs} />

      {/* Top Banner to Track Other Product Orders */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-green-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-green-700 flex-shrink-0" />
          <span>Need to track other products you've already ordered?</span>
        </div>
        <Link to="/orders" className="font-bold text-green-700 hover:text-green-800 flex items-center gap-1 hover:underline">
          <span>Check Order Status</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cart Items List (70% - 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-agri-border p-4 flex items-center justify-between">
            <h1 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-agri-primary" />
              <span>{t('cart.cart_title')} ({items.length})</span>
            </h1>
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              {t('cart.clear_cart')}
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem key={item.id || item.product_id} item={item} />
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-lg border border-agri-border">
            <Link
              to="/products"
              className="text-xs font-bold text-agri-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('cart.continue_shopping')}</span>
            </Link>

            <Link
              to="/orders"
              className="text-xs font-bold text-gray-700 hover:text-green-700 flex items-center gap-1.5 hover:underline"
            >
              <Truck className="w-4 h-4 text-green-700" />
              <span>Check Order Status for Other Products</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Summary (30% - 4 cols) */}
        <div className="lg:col-span-4">
          <CartSummary
            items={items}
            totalAmount={totalAmount}
            onProceed={() => navigate('/checkout')}
            buttonText={t('cart.proceed_to_checkout')}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
