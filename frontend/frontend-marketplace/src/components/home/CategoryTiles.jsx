/**
 * Circular Category shortcuts section on Home page.
 * Fetches real categories from FastAPI GET /categories/.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const DEFAULT_CATEGORY_METADATA = {
  seeds: { icon: '🌱', bg: 'bg-green-100', border: 'border-green-200' },
  fertilizers: { icon: '🧪', bg: 'bg-blue-100', border: 'border-blue-200' },
  pesticides: { icon: '🛡️', bg: 'bg-red-100', border: 'border-red-200' },
  tools: { icon: '🚜', bg: 'bg-amber-100', border: 'border-amber-200' },
  irrigation: { icon: '💧', bg: 'bg-cyan-100', border: 'border-cyan-200' },
  organic: { icon: '🌿', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  machinery: { icon: '⚙️', bg: 'bg-slate-100', border: 'border-slate-200' },
};

export const CategoryTiles = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/');
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          // Fallback standard list
          setCategories([
            { id: 'seeds', slug: 'seeds', name: 'Seeds' },
            { id: 'fertilizers', slug: 'fertilizers', name: 'Fertilizers' },
            { id: 'pesticides', slug: 'pesticides', name: 'Pesticides' },
            { id: 'tools', slug: 'tools', name: 'Tools' },
            { id: 'irrigation', slug: 'irrigation', name: 'Irrigation' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-agri-border p-5 my-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Shop by Farm Category
        </h3>
        <Link to="/products" className="text-xs font-bold text-agri-primary hover:underline">
          View All Categories →
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 text-center">
        {categories.map((cat) => {
          const meta = DEFAULT_CATEGORY_METADATA[cat.slug || cat.id] || {
            icon: '🌾',
            bg: 'bg-green-100',
            border: 'border-green-200',
          };

          return (
            <Link
              key={cat.id || cat.slug}
              to={`/products?category=${cat.slug || cat.id}`}
              className="group flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl ${meta.bg} border ${meta.border} shadow-2xs group-hover:scale-110 transition-transform duration-200`}
              >
                <span>{meta.icon}</span>
              </div>
              <span className="text-xs font-semibold text-gray-800 mt-2 group-hover:text-agri-primary leading-tight truncate max-w-full">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTiles;
