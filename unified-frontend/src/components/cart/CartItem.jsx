/**
 * Cart Line Item component with quantity incrementer, bargained price badges, and delete triggers.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { formatPrice, getEstimatedDeliveryDate } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item }) => {
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product || {};

  const basePrice = Number(product.price || 0);
  const discount = Number(product.discount_percent || 0);
  const regularDiscounted = Math.round(basePrice * (1 - discount / 100));

  const isBargained = item.bargained_price !== null && Number(item.bargained_price) > 0;
  const effectiveUnitPrice = isBargained ? Number(item.bargained_price) : regularDiscounted;
  const lineTotal = effectiveUnitPrice * item.quantity;
  const deliveryDate = getEstimatedDeliveryDate(3);

  return (
    <div className="bg-white p-4 rounded-lg border border-agri-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-gray-300">
      {/* Product Image & Info */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
          <img
            src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=200&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-gray-200"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${item.product_id}`}
            className="font-bold text-sm text-gray-900 hover:text-agri-primary line-clamp-2 block leading-snug"
          >
            {product.name || 'Marketplace Item'}
          </Link>

          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <span>{t('common.by_seller', { name: product.seller?.business_name || product.seller?.full_name || t('product.seller_verified_badge') })}</span>
            {product.seller?.is_verified && <CheckCircle2 className="w-3 h-3 text-agri-primary" />}
          </p>

          {/* Bargain Applied Badge */}
          {isBargained && (
            <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1.5">
              <MessageSquareQuote className="w-3 h-3 text-agri-accent" />
              <span>{t('cart.bargained_deal_applied', { price: formatPrice(effectiveUnitPrice), unit: product.unit || 'unit' })}</span>
            </div>
          )}

          {/* In Stock & Delivery */}
          <div className="text-[11px] text-gray-600 mt-1.5 flex flex-wrap items-center gap-3">
            <span className="text-agri-primary font-semibold">✓ {t('common.in_stock')}</span>
            <span>{t('common.free_delivery_by', { date: deliveryDate })}</span>
          </div>
        </div>
      </div>

      {/* Price & Quantity Controls */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-2">
        {/* Unit Price and Line Total */}
        <div className="text-right">
          <span className="text-base sm:text-lg font-extrabold text-gray-900 block">
            {formatPrice(lineTotal)}
          </span>
          <span className="text-xs text-gray-500">
            {formatPrice(effectiveUnitPrice)} / {product.unit || 'unit'}
            {basePrice > effectiveUnitPrice && (
              <span className="line-through text-gray-400 ml-1.5">
                {formatPrice(basePrice)}
              </span>
            )}
          </span>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-0.5 text-xs font-bold text-gray-900 bg-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.product_id)}
            className="text-gray-400 hover:text-red-600 p-1 transition"
            title={t('cart.remove')}
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
