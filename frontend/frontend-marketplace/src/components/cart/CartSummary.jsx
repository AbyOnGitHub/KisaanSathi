/**
 * Sticky Order Summary Component for Cart & Checkout pages.
 */

import React from 'react';
import { ShieldCheck, Truck, ArrowRight, Tag } from 'lucide-react';
import Button from '../common/Button';
import { formatPrice } from '../../utils/formatters';

export const CartSummary = ({
  items = [],
  totalAmount = 0,
  onProceed,
  buttonText = 'Proceed to Checkout',
  isCheckout = false,
  isLoading = false,
}) => {
  // Compute savings
  let originalMrpTotal = 0;
  let bargainSavings = 0;

  items.forEach((it) => {
    const qty = it.quantity || 1;
    const base = Number(it.product?.price || it.effective_unit_price || 0);
    const discount = Number(it.product?.discount_percent || 0);
    const mrp = discount > 0 ? Math.round(base / (1 - discount / 100)) : base;
    originalMrpTotal += mrp * qty;

    if (it.bargained_price && it.product?.price) {
      bargainSavings += (it.product.price - it.bargained_price) * qty;
    }
  });

  const totalDiscount = Math.max(0, originalMrpTotal - totalAmount);
  const totalSavings = totalDiscount + bargainSavings;

  return (
    <div className="bg-white rounded-lg border border-agri-border p-5 sticky top-24 shadow-card text-xs">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider pb-3 border-b border-gray-100">
        Price Details ({items.length} {items.length === 1 ? 'Item' : 'Items'})
      </h3>

      <div className="py-3 space-y-2.5 text-gray-600 border-b border-gray-100">
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>{formatPrice(originalMrpTotal || totalAmount)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-agri-primary font-semibold">
            <span>Product Discounts</span>
            <span>-{formatPrice(totalDiscount)}</span>
          </div>
        )}

        {bargainSavings > 0 && (
          <div className="flex justify-between text-amber-700 font-bold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Bargain Negotiations</span>
            </span>
            <span>-{formatPrice(bargainSavings)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className="text-agri-primary font-bold">
            <span className="line-through text-gray-400 font-normal mr-1">₹80</span>
            FREE
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="py-3 border-b border-gray-100">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-bold text-gray-900">Total Amount</span>
          <span className="text-xl font-black text-gray-900">{formatPrice(totalAmount)}</span>
        </div>
        {totalSavings > 0 && (
          <p className="text-[11px] font-bold text-agri-primary mt-1">
            🎉 You will save {formatPrice(totalSavings)} on this order!
          </p>
        )}
      </div>

      {/* Checkout CTA */}
      <div className="pt-4">
        <Button
          variant="accent"
          size="lg"
          fullWidth
          onClick={onProceed}
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {buttonText}
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-agri-primary flex-shrink-0" />
          <span>Safe & Secure Payments with 100% Buyer Protection</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Direct doorstep delivery to your farm PIN code</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
