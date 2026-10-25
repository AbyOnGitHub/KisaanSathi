/**
 * Loading spinners and Skeleton cards for product grids and detail views.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className={`flex justify-center items-center py-6 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-agri-primary`} />
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-md border border-agri-border p-3 flex flex-col animate-pulse">
      <div className="w-full h-44 bg-gray-200 rounded-md mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-8 bg-gray-200 rounded mt-auto" />
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Spinner;
