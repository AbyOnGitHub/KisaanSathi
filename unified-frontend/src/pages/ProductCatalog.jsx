/**
 * Product Catalog Page.
 * Flipkart-style filterable catalog with sticky sidebar, sorting pills, and dense product grid.
 * Fully synchronized with React Router useSearchParams for seamless reactive search and filtering.
 */

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ProductFilters from '../components/product/ProductFilters';
import ProductSortBar from '../components/product/ProductSortBar';
import ProductGrid from '../components/product/ProductGrid';
import BargainModal from '../components/bargain/BargainModal';
import Button from '../components/common/Button';
import { useProducts } from '../hooks/useProducts';

export const ProductCatalog = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract all active query parameters directly from the URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('min_price') || null;
  const maxPrice = searchParams.get('max_price') || null;
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const bargainOnly = searchParams.get('bargain_only') === 'true';
  const verifiedOnly = searchParams.get('verified_only') === 'true';
  const minRating = searchParams.get('min_rating') ? Number(searchParams.get('min_rating')) : null;
  const minDiscount = searchParams.get('min_discount') ? Number(searchParams.get('min_discount')) : null;

  const [bargainProduct, setBargainProduct] = useState(null);

  // Directly pass query parameters into useProducts
  const { products, total, limit, loading } = useProducts({
    search,
    category,
    min_price: minPrice,
    max_price: maxPrice,
    sort_by: sortBy,
    page,
    limit: 20,
  });

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== null && value !== '' && value !== false && value !== undefined) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 whenever any filter other than page itself is modified
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage > 1) {
      newParams.set('page', String(newPage));
    } else {
      newParams.delete('page');
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side filtering for UI toggles
  let displayedProducts = [...products];
  if (bargainOnly) {
    displayedProducts = displayedProducts.filter((p) => p.allow_bargaining);
  }
  if (verifiedOnly) {
    displayedProducts = displayedProducts.filter((p) => p.seller?.is_verified);
  }
  if (minRating) {
    displayedProducts = displayedProducts.filter((p) => (p.rating || 0) >= minRating);
  }
  if (minDiscount) {
    displayedProducts = displayedProducts.filter((p) => (p.discount_percent || 0) >= minDiscount);
  }

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : t('nav.all_products');

  const breadcrumbItems = [
    { label: t('footer.marketplace_catalog'), href: '/products' },
    ...(category ? [{ label: categoryName, href: `/products?category=${category}` }] : []),
    ...(search ? [{ label: `${t('common.search')}: "${search}"` }] : []),
  ];

  const totalPages = Math.ceil((total || 0) / (limit || 20));

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
              filters={{
                category,
                search,
                min_price: minPrice,
                max_price: maxPrice,
                sort_by: sortBy,
                bargain_only: bargainOnly,
                verified_only: verifiedOnly,
                min_rating: minRating,
                min_discount: minDiscount,
              }}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Right Product Grid Column */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Header Title & Active Filters Summary */}
          <div className="bg-white rounded-lg border border-agri-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                {search ? (
                  <>
                    <Search className="w-5 h-5 text-agri-primary flex-shrink-0" />
                    <span>{t('catalog.search_results_for', { query: search })}</span>
                  </>
                ) : (
                  <span>{t('catalog.supplies_for_farms', { category: categoryName })}</span>
                )}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {t('catalog.genuine_certified')}
              </p>
            </div>

            {/* Active search pill if search is applied */}
            {search && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-agri-primary border border-green-200 px-2.5 py-1 rounded-full font-bold">
                  <span>"{search}"</span>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="hover:text-red-600 transition ml-0.5"
                    title={t('catalog.clear_search')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-xs font-bold text-gray-500 hover:text-red-600 hover:underline"
                >
                  {t('catalog.clear_search')}
                </button>
              </div>
            )}
          </div>

          {/* Sort Bar */}
          <ProductSortBar
            total={total}
            sortBy={sortBy}
            onSortChange={(val) => handleFilterChange('sort_by', val)}
            page={page}
            limit={limit}
          />

          {/* Product Grid with Skeleton Loader and Custom EmptyState */}
          <ProductGrid
            products={displayedProducts}
            loading={loading}
            onBargainClick={(prod) => setBargainProduct(prod)}
            emptyTitle={search ? t('catalog.no_products_search_title', { query: search }) : t('catalog.no_products_filter_title')}
            emptyDescription={
              search
                ? t('catalog.no_products_search_desc', { query: search })
                : t('catalog.no_products_filter_desc')
            }
            emptyActionText={search ? t('catalog.clear_search') : t('common.clear_all')}
            onEmptyAction={search ? handleClearSearch : handleResetFilters}
          />

          {/* Pagination */}
          {!loading && displayedProducts.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                {t('common.previous')}
              </Button>
              <span className="text-xs font-bold text-gray-700 px-3 py-1 bg-white border border-gray-300 rounded">
                {t('common.page_of', { page, total: totalPages })}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                {t('common.next')}
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
