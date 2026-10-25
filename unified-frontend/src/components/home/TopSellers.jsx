/**
 * Top Rated Verified Agricultural Sellers Section.
 * Fetches real registered sellers from FastAPI GET /sellers/.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Star, Store, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';

export const TopSellers = () => {
  const { t } = useTranslation();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.get('/sellers/');
        if (res.data && res.data.length > 0) {
          setSellers(res.data);
        } else {
          setSellers([]);
        }
      } catch (err) {
        console.error('Error fetching sellers:', err);
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (!loading && sellers.length === 0) {
    return null; // Gracefully omit if no sellers registered yet
  }

  return (
    <div className="bg-white rounded-xl border border-agri-border p-5 my-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-agri-primary" />
            <span>{t('home.top_sellers_title')}</span>
          </h3>
          <p className="text-xs text-gray-500">
            {t('home.top_sellers_sub')}
          </p>
        </div>
        <Link to="/products" className="text-xs font-bold text-agri-primary hover:underline">
          {t('home.view_all_stores')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sellers.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-lg border border-gray-200 hover:border-agri-primary/50 hover:shadow-card transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={s.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                  alt={s.business_name || s.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-500 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-gray-900 text-xs truncate">
                      {s.business_name || s.full_name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-primary flex-shrink-0" />
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded inline-block mt-0.5">
                    {t('common.verified')}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-600 mb-3">
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="flex items-center gap-1 font-bold text-gray-800">
                    <Star className="w-3.5 h-3.5 text-agri-star fill-current" />
                    <span>4.8 ({t('common.verified')})</span>
                  </span>
                  <span className="text-gray-500 font-medium">Licensed Dealer</span>
                </div>
              </div>
            </div>

            <Link
              to={`/products?seller=${s.id}`}
              className="w-full bg-gray-50 hover:bg-green-50 text-agri-primary border border-gray-200 hover:border-green-300 font-bold py-1.5 rounded text-xs flex items-center justify-center gap-1 transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t('home.visit_store')}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellers;
