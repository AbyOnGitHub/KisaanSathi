/**
 * Product Catalog Page.
 * Flipkart-style filterable catalog with sticky sidebar, sorting pills, and dense product grid.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ProductFilters from '../components/product/ProductFilters';
import ProductSortBar from '../components/product/ProductSortBar';
import ProductGrid from '../components/product/ProductGrid';
import BargainModal from '../components/bargain/BargainModal';
import Button from '../components/common/Button';
import { useProducts } from '../hooks/useProducts';

export const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse query params from URL
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort_by') || 'created_at';

  const [filters, setFilters] = useState({
    category: initialCategory,
    search: initialSearch,
    min_price: null,
    max_price: null,
    min_rating: null,
    min_discount: null,
    bargain_only: false,
    verified_only: false,
    sort_by: initialSort,
  });

  const [bargainProduct, setBargainProduct] = useState(null);
  const { products, total, page, limit, setPage, loading, refetch } = useProducts(filters);

  // Sync URL search params with state
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q = searchParams.get('search') || '';
    const s = searchParams.get('sort_by') || 'created_at';
    setFilters((prev) => ({ ...prev, category: cat, search: q, sort_by: s }));
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value !== null && value !== '' && value !== false) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    refetch(updated);
  };

  const handleResetFilters = () => {
    const clean = {
      category: '',
      search: '',
      min_price: null,
      max_price: null,
      min_rating: null,
      min_discount: null,
      bargain_only: false,
      verified_only: false,
      sort_by: 'created_at',
    };
    setFilters(clean);
    setSearchParams({});
    refetch(clean);
  };

  // Client side filtering for bargain_only, verified_only, min_rating, min_discount
  let displayedProducts = [...products];
  if (filters.bargain_only) {
    displayedProducts = displayedProducts.filter((p) => p.allow_bargaining);
  }
  if (filters.verified_only) {
    displayedProducts = displayedProducts.filter((p) => p.seller?.is_verified);
  }
  if (filters.min_rating) {
    displayedProducts = displayedProducts.filter((p) => (p.rating || 0) >= filters.min_rating);
  }
  if (filters.min_discount) {
    displayedProducts = displayedProducts.filter((p) => (p.discount_percent || 0) >= filters.min_discount);
  }

  const categoryName = filters.category
    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
    : 'All Supplies';

  const breadcrumbItems = [
    { label: 'Marketplace', href: '/products' },
    ...(filters.category ? [{ label: categoryName }] : []),
    ...(filters.search ? [{ label: `Search: "${filters.search}"` }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Main Catalog Layout */}
      <div className="flex flex-col md:flex-row gap-5 mt-2">
        {/* Left Sticky Sidebar (260px) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Right Product Grid Column */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Header Title & Active Filters Summary */}
          <div className="bg-white rounded-lg border border-agri-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                {filters.search
                  ? `Search Results for "${filters.search}"`
                  : `${categoryName} for Indian Farms`}
              </h1>
              <p className="text-xs text-gray-500">
                Genuine certified farm inputs directly from registered suppliers
              </p>
            </div>
          </div>

          {/* Sort Bar */}
          <ProductSortBar
            total={displayedProducts.length}
            sortBy={filters.sort_by}
            onSortChange={(val) => handleFilterChange('sort_by', val)}
            page={page}
            limit={limit}
          />

          {/* Product Grid */}
          <ProductGrid
            products={displayedProducts}
            loading={loading}
            onBargainClick={(prod) => setBargainProduct(prod)}
          />

          {/* Pagination */}
          {displayedProducts.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-gray-700 px-3 py-1 bg-white border border-gray-300 rounded">
                Page {page}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={displayedProducts.length < limit}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bargain Negotiation Modal */}
      {bargainProduct && (
        <BargainModal
          isOpen={!!bargainProduct}
          onClose={() => setBargainProduct(null)}
          product={bargainProduct}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
