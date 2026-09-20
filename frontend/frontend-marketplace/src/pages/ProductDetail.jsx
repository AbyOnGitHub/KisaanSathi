/**
 * Amazon-style Product Detail Page.
 * 3-Column layout: Image Gallery + Product Configuration/Mandi rates + Sticky Seller Card.
 * Directly connected to FastAPI backend.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Zap,
  MessageSquareQuote,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  AlertCircle,
} from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ProductGallery from '../components/product/ProductGallery';
import MarketPriceBadge from '../components/product/MarketPriceBadge';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';
import SellerCard from '../components/seller/SellerCard';
import BargainModal from '../components/bargain/BargainModal';
import EmptyState from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { formatPrice, getEstimatedDeliveryDate } from '../utils/formatters';
import api from '../utils/api';

export const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [bargainModalOpen, setBargainModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data) {
          setProduct(res.data);
          setQuantity(res.data.min_order || 1);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
        setError(err.response?.data?.detail || 'Product not found or currently unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" />}
          title={t('product.not_available_title')}
          description={error || t('product.not_available_desc')}
          actionText={t('product.explore_catalog_btn')}
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const basePrice = Number(product.price);
  const discount = Number(product.discount_percent || 0);
  const mrp = discount > 0 ? Math.round(basePrice / (1 - discount / 100)) : null;
  const savings = mrp ? mrp - basePrice : 0;
  const deliveryDate = getEstimatedDeliveryDate(3);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const breadcrumbs = [
    { label: t('footer.marketplace_catalog'), href: '/products' },
    { label: product.category?.name || t('catalog.category_title'), href: `/products?category=${product.category?.slug || 'seeds'}` },
    { label: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 3-Column Main Product Grid (Amazon India Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-6 rounded-xl border border-agri-border shadow-xs">
        {/* COLUMN 1: Images (40% - 5 cols) */}
        <div className="lg:col-span-5">
          <ProductGallery
            images={product.image_urls}
            productName={product.name}
          />
        </div>

        {/* COLUMN 2: Details & Buying Box (40% - 4.5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-[10px] text-agri-primary font-bold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded">
              {product.category?.name || t('product.verified_badge')}
            </span>
            <h1 className="text-base sm:text-xl font-black text-gray-900 leading-snug mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={product.rating || 4.6} totalReviews={product.total_reviews || 184} size={14} />
              <span className="text-gray-300">|</span>
              <span className="text-xs text-agri-primary font-semibold">{t('product.bought_this_season')}</span>
            </div>
          </div>

          {/* Highlighted Price Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-agri-primary">
                {formatPrice(basePrice)}
              </span>
              <span className="text-xs font-semibold text-gray-600">/ {product.unit || 'unit'}</span>
              {mrp && (
                <span className="text-sm text-gray-400 line-through">
                  {t('common.mrp')}: {formatPrice(mrp)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-agri-hot text-white font-extrabold text-xs px-2 py-0.5 rounded">
                  {t('common.off', { discount })}
                </span>
              )}
            </div>

            {savings > 0 && (
              <p className="text-xs font-bold text-green-800">
                {t('common.you_save', { amount: formatPrice(savings), discount })}
              </p>
            )}
          </div>

          {/* Mandi Rate Comparison Widget */}
          <MarketPriceBadge productId={product.id} fallbackProduct={product} />

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs font-bold text-gray-800">{t('product.quantity_label')}</span>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(product.min_order || 1, quantity - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 py-1 text-sm font-bold text-gray-900 bg-gray-50">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {product.min_order > 1 && (
              <span className="text-[11px] text-gray-500">
                {t('product.min_order', { count: product.min_order, unit: product.unit })}
              </span>
            )}
          </div>

          {/* Stacked Large Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isAdding}
              onClick={handleAddToCart}
              leftIcon={<ShoppingCart className="w-5 h-5" />}
            >
              {t('product.add_to_cart', { amount: formatPrice(basePrice * quantity) })}
            </Button>

            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={handleBuyNow}
              leftIcon={<Zap className="w-5 h-5" />}
            >
              {t('product.buy_now')}
            </Button>

            {product.allow_bargaining && (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setBargainModalOpen(true)}
                leftIcon={<MessageSquareQuote className="w-5 h-5" />}
              >
                {t('product.start_bargain')}
              </Button>
            )}
          </div>

          {/* Delivery & Protection Info Box */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Truck className="w-4 h-4 text-agri-primary" />
              <span>
                {t('product.free_delivery_to', { date: deliveryDate })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>{t('common.days_return')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{t('common.buyer_protection')}</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Seller Card (20% - 2.5 cols) */}
        <div className="lg:col-span-3">
          <SellerCard seller={product.seller} onContactSeller={() => setBargainModalOpen(true)} />
        </div>
      </div>

      {/* BELOW THE FOLD: Specifications, Details, & Reviews */}
      <div className="bg-white rounded-xl border border-agri-border p-6 shadow-xs space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 transition relative ${
              activeTab === 'description'
                ? 'text-agri-primary border-b-2 border-agri-primary'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('product.tab_desc')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition relative ${
              activeTab === 'specs'
                ? 'text-agri-primary border-b-2 border-agri-primary'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('product.tab_specs')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition relative ${
              activeTab === 'reviews'
                ? 'text-agri-primary border-b-2 border-agri-primary'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('product.tab_reviews', { count: product.total_reviews || 0 })}
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl">
            <p>{product.description || 'No description provided for this product listing.'}</p>
          </div>
        )}

        {/* Tab 2: Technical Specifications Table */}
        {activeTab === 'specs' && (
          <div className="max-w-2xl border border-gray-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <td className="py-2.5 px-4 font-bold text-gray-700 w-1/3">{t('product.brand_supplier')}</td>
                  <td className="py-2.5 px-4 text-gray-900">{product.seller?.business_name || product.seller?.full_name || t('product.agrimart_direct')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-gray-700">{t('catalog.category_title')}</td>
                  <td className="py-2.5 px-4 text-gray-900">{product.category?.name || 'Farm Inputs'}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2.5 px-4 font-bold text-gray-700">{t('product.packaging_unit')}</td>
                  <td className="py-2.5 px-4 text-gray-900">{product.unit || 'Standard Pack'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-gray-700">{t('product.stock_availability')}</td>
                  <td className="py-2.5 px-4 text-gray-900">{t('common.units_ready', { count: product.stock })}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2.5 px-4 font-bold text-gray-700">{t('product.govt_verification')}</td>
                  <td className="py-2.5 px-4 text-green-700 font-bold">{t('product.cib_registered')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center sm:text-left">
                <span className="text-3xl font-black text-gray-900">{product.rating || 4.6}</span>
                <span className="text-xs text-gray-500 block">{t('product.out_of_5_stars')}</span>
                <div className="mt-1">
                  <StarRating rating={product.rating || 4.6} showNumber={false} size={16} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bargain Negotiation Modal */}
      {bargainModalOpen && (
        <BargainModal
          isOpen={bargainModalOpen}
          onClose={() => setBargainModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductDetail;
