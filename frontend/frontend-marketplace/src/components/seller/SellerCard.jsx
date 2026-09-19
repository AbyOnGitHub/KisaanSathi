/**
 * Verified Seller Card for Product Detail page right-hand column.
 */

import React from 'react';
import { CheckCircle2, Star, MapPin, Store, MessageSquare, Award } from 'lucide-react';
import Button from '../common/Button';

export const SellerCard = ({ seller = null, onContactSeller = null }) => {
  const sellerName = seller?.business_name || seller?.full_name || 'Kisan Agro Supplies Mandi';
  const avatar =
    seller?.avatar_url ||
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-lg border border-agri-border p-4 sticky top-24 shadow-card text-xs space-y-4">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={sellerName}
          className="w-12 h-12 rounded-full object-cover border-2 border-green-500 shadow-2xs"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900 text-sm truncate">{sellerName}</span>
            {seller?.is_verified && (
              <CheckCircle2 className="w-4 h-4 text-agri-primary flex-shrink-0" title="Verified Seller" />
            )}
          </div>
          <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>Nagpur, Maharashtra</span>
          </p>
        </div>
      </div>

      {/* Trust & Ratings Badges */}
      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-md border border-gray-100 text-[11px]">
        <div>
          <span className="text-gray-500 block">Seller Rating</span>
          <span className="font-extrabold text-gray-900 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-agri-star fill-current" />
            <span>4.8 / 5.0</span>
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Experience</span>
          <span className="font-extrabold text-gray-900 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-agri-primary" />
            <span>Since 2021</span>
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-[11px] text-gray-600">
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-agri-primary"></span>
          <span><strong>98%</strong> On-time Delivery Rate</span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-agri-primary"></span>
          <span><strong>GSTIN & License</strong> Verified by AgriMart</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          leftIcon={<Store className="w-3.5 h-3.5" />}
          onClick={() => {}}
        >
          Visit Storefront
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
          onClick={onContactSeller || (() => {})}
        >
          Chat with Seller
        </Button>
      </div>
    </div>
  );
};

export default SellerCard;
