/**
 * Reusable Badge component for discounts, stock indicators, and statuses.
 */

import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default', 'success', 'warning', 'hot', 'bargain', 'verified', 'outline'
  size = 'sm', // 'xs', 'sm', 'md'
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full select-none';

  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    hot: 'bg-red-600 text-white shadow-xs',
    bargain: 'bg-amber-500 text-white',
    verified: 'bg-blue-100 text-blue-800 border border-blue-200',
    outline: 'border border-gray-300 text-gray-700 bg-white',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.default}
        ${sizeStyles[size] || sizeStyles.sm}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
