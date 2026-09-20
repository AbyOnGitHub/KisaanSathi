/**
 * Amazon-style Product Image Gallery with thumbnail selector, zoom preview, and share triggers.
 */

import React, { useState } from 'react';
import { Heart, Share2, ZoomIn } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductGallery = ({ images = [], productName = 'Product' }) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1594488518002-390919246193?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
  ];

  const galleryImages = images && images.length > 0 ? images : fallbackImages;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Check out ${productName} on AgriMart!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative bg-white rounded-lg border border-agri-border overflow-hidden pt-[90%] sm:pt-[85%] group">
        <img
          src={galleryImages[selectedIndex]}
          alt={productName}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Zoom Hint */}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          <ZoomIn className="w-3 h-3" />
          <span>Click to Zoom</span>
        </div>

        {/* Top Right Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              toast.success(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
            }}
            className="p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-red-500 transition border border-gray-100"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white shadow-md text-gray-500 hover:text-agri-primary transition border border-gray-100"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2 overflow-hidden flex-shrink-0 bg-white transition p-1 ${
                selectedIndex === idx
                  ? 'border-agri-primary shadow-xs ring-1 ring-agri-primary'
                  : 'border-gray-200 hover:border-gray-400 opacity-80'
              }`}
            >
              <img
                src={img}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
