/**
 * Flipkart-style Left Sidebar Filter component for Product Catalog.
 * Includes Category tree, Price range slider, Rating filter, Discount filters, and Bargain toggle.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const ProductFilters = ({
  filters = {},
  onFilterChange,
  onResetFilters,
  className = '',
}) => {
  const { t } = useTranslation();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);

  const categories = [
    { id: '', label: t('nav.all_categories') },
    { id: 'seeds', label: t('nav.cat_seeds') },
    { id: 'fertilizers', label: t('nav.cat_fertilizers') },
    { id: 'pesticides', label: t('nav.cat_pesticides') },
    { id: 'tools', label: t('nav.cat_tools') },
    { id: 'irrigation', label: t('nav.cat_irrigation') },
  ];

  const ratingOptions = [4, 3, 2];
  const discountOptions = [10, 20, 30, 40];

  return (
    <aside className={`bg-white rounded-lg border border-agri-border p-4 text-xs ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
          <Filter className="w-4 h-4 text-agri-primary" />
          <span>{t('catalog.filters_title')}</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-agri-primary hover:underline text-xs font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('common.clear_all')}</span>
        </button>
      </div>

      {/* 1. Category Tree */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="w-full flex items-center justify-between font-bold text-gray-900 text-xs mb-2"
        >
          <span>{t('catalog.category_title')}</span>
          {categoriesOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
        </button>

        {categoriesOpen && (
          <div className="space-y-1 mt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange('category', cat.id)}
                className={`w-full text-left py-1 px-2 rounded transition flex items-center justify-between ${
                  (filters.category || '') === cat.id
                    ? 'bg-green-50 text-agri-primary font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Bargain-Enabled Only Toggle */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.bargain_only}
            onChange={(e) => onFilterChange('bargain_only', e.target.checked)}
            className="w-4 h-4 rounded text-agri-primary focus:ring-agri-primary accent-agri-primary cursor-pointer"
          />
          <span className="font-bold text-gray-900 flex items-center gap-1">
            <span>{t('catalog.bargain_available_only')}</span>
          </span>
        </label>
        <p className="text-[10px] text-gray-400 mt-1 pl-6">
          {t('catalog.bargain_available_desc')}
        </p>
      </div>

      {/* 3. Verified Seller Only Toggle */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.verified_only}
            onChange={(e) => onFilterChange('verified_only', e.target.checked)}
            className="w-4 h-4 rounded text-agri-primary focus:ring-agri-primary accent-agri-primary cursor-pointer"
          />
          <span className="font-bold text-gray-900">
            {t('catalog.verified_sellers_only')}
          </span>
        </label>
      </div>

      {/* 4. Price Range Filter */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between font-bold text-gray-900 text-xs mb-2"
        >
          <span>{t('catalog.price_range_title')}</span>
          {priceOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
        </button>

        {priceOpen && (
          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-gray-500 block mb-0.5">{t('catalog.min_rs')}</span>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.min_price || ''}
                  onChange={(e) => onFilterChange('min_price', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                />
              </div>
              <span className="text-gray-400 mt-3">-</span>
              <div className="flex-1">
                <span className="text-[10px] text-gray-500 block mb-0.5">{t('catalog.max_rs')}</span>
                <input
                  type="number"
                  placeholder="50,000"
                  value={filters.max_price || ''}
                  onChange={(e) => onFilterChange('max_price', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-agri-primary"
                />
              </div>
            </div>

            {/* Quick Price Shortcuts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: t('catalog.under_500'), max: 500 },
                { label: t('catalog.between_500_2000'), min: 500, max: 2000 },
                { label: t('catalog.above_2000'), min: 2000 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onFilterChange('min_price', p.min || null);
                    onFilterChange('max_price', p.max || null);
                  }}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Rating Filter */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => setRatingOpen(!ratingOpen)}
          className="w-full flex items-center justify-between font-bold text-gray-900 text-xs mb-2"
        >
          <span>{t('catalog.customer_ratings_title')}</span>
          {ratingOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
        </button>

        {ratingOpen && (
          <div className="space-y-1.5 mt-1">
            {ratingOptions.map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={Number(filters.min_rating) === r}
                  onChange={() => onFilterChange('min_rating', r)}
                  className="accent-agri-primary cursor-pointer"
                />
                <span className="flex items-center gap-1 font-medium">
                  <span>{t('catalog.stars_and_above', { stars: r })}</span>
                  <div className="flex text-agri-star">
                    {[...Array(r)].map((_, i) => (
                      <Star key={i} size={11} className="fill-current" />
                    ))}
                  </div>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. Discount Filter */}
      <div>
        <button
          onClick={() => setDiscountOpen(!discountOpen)}
          className="w-full flex items-center justify-between font-bold text-gray-900 text-xs mb-2"
        >
          <span>{t('catalog.discount_title')}</span>
          {discountOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
        </button>

        {discountOpen && (
          <div className="space-y-1.5 mt-1">
            {discountOptions.map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900"
              >
                <input
                  type="radio"
                  name="discount"
                  checked={Number(filters.min_discount) === d}
                  onChange={() => onFilterChange('min_discount', d)}
                  className="accent-agri-primary cursor-pointer"
                />
                <span className="font-medium">{t('catalog.off_or_more', { discount: d })}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProductFilters;
