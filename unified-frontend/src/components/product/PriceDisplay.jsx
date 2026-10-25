/**
 * Standard Price Display component with MRP strikethrough, discount tag, and unit.
 */

import React from 'react';
import { formatPrice } from '../../utils/formatters';

export const PriceDisplay = ({
  price = 0,
  discountPercent = 0,
  unit = 'unit',
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  className = '',
}) => {
  const sellingPrice = Number(price);
  const discount = Number(discountPercent) || 0;
  // Calculate approximate original MRP before discount
  const mrp = discount > 0 ? Math.round(sellingPrice / (1 - discount / 100)) : null;

  const sizeClasses = {
    sm: { price: 'text-sm font-bold', mrp: 'text-xs', badge: 'text-[10px]' },
    md: { price: 'text-base sm:text-lg font-extrabold', mrp: 'text-xs', badge: 'text-[11px]' },
    lg: { price: 'text-2xl sm:text-3xl font-extrabold text-agri-primary', mrp: 'text-sm', badge: 'text-xs' },
    xl: { price: 'text-3xl sm:text-4xl font-black text-agri-primary', mrp: 'text-base', badge: 'text-sm' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      {/* Current Selling Price */}
      <span className={`${currentSize.price} text-gray-900 leading-none`}>
        {formatPrice(sellingPrice)}
      </span>

      {/* Unit */}
      {unit && (
        <span className="text-xs text-gray-500 font-medium">
          / {unit}
        </span>
      )}

      {/* Original MRP with strikethrough */}
      {mrp && mrp > sellingPrice && (
        <span className={`${currentSize.mrp} text-gray-400 line-through`}>
          {formatPrice(mrp)}
        </span>
      )}

      {/* Discount Percentage Badge */}
      {discount > 0 && (
        <span className={`${currentSize.badge} font-bold text-agri-hot bg-red-50 px-1.5 py-0.5 rounded`}>
          {discount}% OFF
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
