/**
 * Amazon & Flipkart inspired dense Product Card.
 * Includes zoom-on-hover, discount tags, live bargain trigger, rating stars, and quick actions.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart, MessageSquareQuote, CheckCircle2, Truck } from 'lucide-react';
import StarRating from '../common/StarRating';
import PriceDisplay from './PriceDisplay';
import { useCart } from '../../context/CartContext';
import { getEstimatedDeliveryDate } from '../../utils/formatters';

export const ProductCard = ({ product, onBargainClick = null }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const mainImage =
    product.image_urls?.[0] ||
    'https://images.unsplash.com/photo-1594488518002-390919246193?w=500&auto=format&fit=crop&q=80';

  const sellerName = product.seller?.business_name || product.seller?.full_name || t('product.seller_verified_badge');
  const deliveryDate = getEstimatedDeliveryDate(3);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, 1);
    setIsAdding(false);
  };

  const handleBargain = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBargainClick) {
      onBargainClick(product);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group bg-white rounded-lg border border-agri-border hover:border-gray-300 hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Product Image Link Container */}
      <Link to={`/products/${product.id}`} className="relative block bg-gray-50 pt-[100%] overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Left Discount Badge */}
        {product.discount_percent > 0 && (
          <div className="absolute top-2 left-2 bg-agri-hot text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wide">
            {t('common.off', { discount: product.discount_percent })}
          </div>
        )}

        {/* Top-Right Bargain Available Badge */}
        {product.allow_bargaining && (
          <div className="absolute top-2 right-2 bg-agri-accent text-gray-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <span>💬 {t('nav.bargains')}</span>
          </div>
        )}

        {/* Wishlist Heart Icon (Visible on hover or active) */}
        <button
          onClick={toggleWishlist}
          className={`absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-400 hover:text-red-500 transition ${
            isWishlisted ? 'text-red-500 opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Product Details Section */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            {product.category?.name || t('catalog.category_title')}
          </span>

          {/* Product Title (2-lines max) */}
          <Link
            to={`/products/${product.id}`}
            className="block text-xs sm:text-sm font-semibold text-gray-900 hover:text-agri-primary line-clamp-2 leading-snug my-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating + Total Reviews */}
          <div className="my-1">
            <StarRating rating={product.rating || 4.5} totalReviews={product.total_reviews || 84} size={12} />
          </div>

          {/* Price Display */}
          <div className="mt-1 mb-2">
            <PriceDisplay
              price={product.price}
              discountPercent={product.discount_percent}
              unit={product.unit}
              size="sm"
            />
          </div>

          {/* Seller Line with Verified Checkmark */}
          <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
            <span>{t('common.by_seller', { name: sellerName })}</span>
            {product.seller?.is_verified && (
              <CheckCircle2 className="w-3 h-3 text-agri-primary flex-shrink-0" />
            )}
          </p>

          {/* Delivery Estimate */}
          <div className="flex items-center gap-1 text-[10px] text-gray-600 mt-1">
            <Truck className="w-3 h-3 text-agri-primary" />
            <span>{t('common.free_delivery_by', { date: deliveryDate })}</span>
          </div>
        </div>

        {/* Action Buttons (Add to Cart & Bargain) */}
        <div className="mt-3 pt-2 border-t border-gray-100 grid grid-cols-2 gap-1.5">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock <= 0}
            className="w-full bg-agri-primary hover:bg-agri-dark text-white text-xs font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition shadow-2xs disabled:opacity-50"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{product.stock <= 0 ? t('common.out_of_stock') : t('common.add')}</span>
          </button>

          {product.allow_bargaining ? (
            <button
              onClick={handleBargain}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-agri-accent text-xs font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-agri-accent" />
              <span>{t('nav.bargains')}</span>
            </button>
          ) : (
            <Link
              to={`/products/${product.id}`}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-1.5 px-2 rounded flex items-center justify-center text-center transition"
            >
              {t('common.details')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
