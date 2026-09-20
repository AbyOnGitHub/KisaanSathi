/**
 * Responsive Product Grid layout with loading skeleton states and empty state.
 */

import React from 'react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/Loader';
import EmptyState from '../common/EmptyState';

export const ProductGrid = ({
  products = [],
  loading = false,
  onBargainClick = null,
  emptyTitle = 'No products available',
  emptyDescription = 'Try adjusting your search filters or browse other categories.',
  emptyActionText = null,
  onEmptyAction = null,
}) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onBargainClick={onBargainClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
