/**
 * Reusable Button component with multiple visual styles, loading states, and icon support.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'accent', 'hot', 'outline', 'ghost', 'link'
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary: 'bg-agri-primary text-white hover:bg-agri-dark focus:ring-agri-primary shadow-sm',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
    accent: 'bg-agri-accent text-white hover:bg-amber-600 focus:ring-agri-accent shadow-sm font-semibold',
    hot: 'bg-agri-hot text-white hover:bg-red-700 focus:ring-agri-hot shadow-sm font-semibold',
    outline: 'border-2 border-agri-primary text-agri-primary bg-white hover:bg-green-50 focus:ring-agri-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    link: 'text-agri-primary hover:underline p-0 focus:ring-0',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5 font-semibold',
    xl: 'text-lg px-8 py-3.5 gap-3 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-1" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon ? <span className="flex-shrink-0">{rightIcon}</span> : null}
    </button>
  );
};

export default Button;
