/**
 * AgriMart Commercial Home Page.
 * Styled like Amazon India & Flipkart with hero promo carousel, category tiles,
 * countdown deals of the day, verified top sellers, crop bundles, and trust guarantees.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryTiles from '../components/home/CategoryTiles';
import DealsOfTheDay from '../components/home/DealsOfTheDay';
import TopSellers from '../components/home/TopSellers';
import TrustBadges from '../components/home/TrustBadges';
import ProductGrid from '../components/product/ProductGrid';
import BargainModal from '../components/bargain/BargainModal';
import { useProducts } from '../hooks/useProducts';

export const Home = () => {
  const { products, loading } = useProducts();
  const [bargainProduct, setBargainProduct] = useState(null);

  const cropBundles = [
    {
      crop: 'Cotton (Kapas)',
      title: 'Cotton Complete Package',
      desc: 'Bollgard II Seeds + DAP + Bio-Insecticide',
      image: 'https://images.unsplash.com/photo-1594488518002-390919246193?w=500&auto=format&fit=crop&q=80',
      link: '/products?search=cotton',
    },
    {
      crop: 'Paddy / Rice (Dhan)',
      title: 'Basmati & High-Yield Rice Kit',
      desc: 'Hybrid Seed + Zinc Fertilizer + Weedicide',
      image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80',
      link: '/products?search=rice',
    },
    {
      crop: 'Wheat (Gehun)',
      title: 'Rabi Season Wheat Care',
      desc: 'Certified Wheat Seed + Potash + Sprayer',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=80',
      link: '/products?search=wheat',
    },
    {
      crop: 'Sugarcane (Ganna)',
      title: 'Sugarcane Yield Booster',
      desc: 'Nutrient Mix + Drip Tube + Micro-Nutrients',
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500&auto=format&fit=crop&q=80',
      link: '/products?search=sugarcane',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 space-y-8">
      {/* 1. Hero Promo Carousel */}
      <HeroCarousel />

      {/* 2. Category Shortcuts */}
      <CategoryTiles />

      {/* 3. Deals of the Day (Countdown timer) */}
      <DealsOfTheDay
        products={products}
        onBargainClick={(prod) => setBargainProduct(prod)}
      />

      {/* 4. Shop by Major Indian Crop Bundles */}
      <div className="bg-white rounded-xl border border-agri-border p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-agri-accent" />
              <span>Shop by Crop Specialization</span>
            </h3>
            <p className="text-xs text-gray-500">
              Complete sowing-to-harvest input bundles tailored for Indian crops
            </p>
          </div>
          <Link to="/products" className="text-xs font-bold text-agri-primary hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cropBundles.map((b, i) => (
            <Link
              key={i}
              to={b.link}
              className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-card transition flex flex-col"
            >
              <div className="relative pt-[60%] overflow-hidden bg-gray-100">
                <img
                  src={b.image}
                  alt={b.crop}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {b.crop}
                </div>
              </div>

              <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs group-hover:text-agri-primary transition">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1">{b.desc}</p>
                </div>
                <span className="text-[11px] font-bold text-agri-primary mt-2 flex items-center gap-0.5">
                  Shop Inputs →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Top Rated Sellers */}
      <TopSellers />

      {/* 6. Featured Products Grid */}
      <div className="bg-white rounded-xl border border-agri-border p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Trending Agricultural Supplies
            </h3>
            <p className="text-xs text-gray-500">
              Top selling certified seeds, organic fertilizers, and farm equipment
            </p>
          </div>
          <Link to="/products" className="text-xs font-bold text-agri-primary hover:underline">
            View All ({products.length}) →
          </Link>
        </div>

        <ProductGrid
          products={products}
          loading={loading}
          onBargainClick={(prod) => setBargainProduct(prod)}
        />
      </div>

      {/* 7. Trust Badges & Newsletter */}
      <TrustBadges />

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

export default Home;
