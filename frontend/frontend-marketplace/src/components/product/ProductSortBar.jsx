/**
 * Product Catalog Sort Bar.
 * Shows total product counts and sort criteria pills.
 */

import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';

export const ProductSortBar = ({
  total = 0,
  sortBy = 'created_at',
  onSortChange,
  page = 1,
  limit = 20,
}) => {
  const { t } = useTranslation();

  const sortOptions = [
    { id: 'created_at', label: t('catalog.sort_popular') },
    { id: 'price_asc', label: t('catalog.sort_price_low_high') },
    { id: 'price_desc', label: t('catalog.sort_price_high_low') },
    { id: 'rating', label: t('catalog.sort_rating') },
  ];

  const startIdx = total > 0 ? (page - 1) * limit + 1 : 0;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="bg-white rounded-lg border border-agri-border p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      {/* Results Count */}
      <div className="text-gray-600 font-medium">
        <Trans i18nKey="catalog.showing_results" values={{ start: startIdx, end: endIdx, total }}>
          Showing <strong className="text-gray-900">{{ start: startIdx }}-{{ end: endIdx }}</strong> of{' '}
          <strong className="text-gray-900">{{ total }}</strong> products
        </Trans>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="font-bold text-gray-700 flex items-center gap-1 flex-shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
          <span>{t('catalog.sort_by')}</span>
        </span>

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSortChange(opt.id)}
              className={`px-2.5 py-1 rounded-full font-semibold transition ${
                sortBy === opt.id
                  ? 'bg-agri-primary text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSortBar;
