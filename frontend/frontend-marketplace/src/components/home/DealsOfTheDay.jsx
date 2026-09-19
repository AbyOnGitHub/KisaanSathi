/**
 * Deals of the Day section with countdown timer badge and featured discounted products.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';

export const DealsOfTheDay = ({ products = [], onBargainClick = null }) => {
  // 12-hour countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = (products || []).filter((p) => (p.discount_percent || 0) > 0).slice(0, 4);

  if (!dealProducts || dealProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50/70 via-amber-50/50 to-green-50/60 rounded-xl border border-red-200/80 p-5 my-6 shadow-xs">
      {/* Deals Header with Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-red-200/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-agri-hot text-white rounded-lg shadow-xs animate-bounce">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Deals of the Day</span>
              <span className="text-xs font-bold bg-agri-hot text-white px-2 py-0.5 rounded-full">
                HOT OFFERS
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Limited inventory at subsidized seasonal wholesale prices
            </p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 text-xs text-red-700 font-bold bg-white px-3 py-1.5 rounded-md border border-red-300 shadow-2xs">
            <Clock className="w-4 h-4 text-agri-hot animate-spin" style={{ animationDuration: '6s' }} />
            <span>Ends in:</span>
            <span className="font-mono font-black text-gray-900">
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          <Link
            to="/products?sort_by=discount"
            className="text-xs font-bold text-agri-primary hover:underline flex items-center gap-0.5"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {dealProducts.map((p) => (
          <ProductCard key={p.id} product={p} onBargainClick={onBargainClick} />
        ))}
      </div>
    </div>
  );
};

export default DealsOfTheDay;
