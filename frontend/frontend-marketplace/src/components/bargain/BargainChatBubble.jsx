/**
 * WhatsApp-style Bargain Chat Bubble component.
 */

import React from 'react';
import { User, Store, Tag } from 'lucide-react';
import { formatPrice, timeAgo } from '../../utils/formatters';

export const BargainChatBubble = ({ offer, isCurrentUser = false }) => {
  const isFarmer = offer.offered_by === 'farmer';

  return (
    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} my-2.5 max-w-[85%] sm:max-w-[70%] ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
      {/* Sender Header */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1 px-1">
        {isFarmer ? (
          <User className="w-3 h-3 text-agri-primary" />
        ) : (
          <Store className="w-3 h-3 text-amber-600" />
        )}
        <span className="font-bold">
          {isFarmer ? 'Farmer Offer' : 'Seller Counter-Offer'}
        </span>
        <span>• {timeAgo(offer.created_at)}</span>
      </div>

      {/* Bubble Box */}
      <div
        className={`p-3.5 rounded-2xl shadow-xs border text-xs leading-relaxed ${
          isCurrentUser
            ? 'bg-green-50 border-green-200 text-gray-900 rounded-tr-none'
            : 'bg-white border-gray-200 text-gray-900 rounded-tl-none'
        }`}
      >
        {/* Highlighted Proposed Price */}
        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-200/60">
          <div className="p-1.5 bg-agri-primary/10 rounded-lg text-agri-primary">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">Proposed Price</span>
            <span className="text-base font-extrabold text-agri-primary">
              {formatPrice(offer.offered_price)}{' '}
              <span className="text-xs font-normal text-gray-500">
                (for {offer.quantity || 1} units)
              </span>
            </span>
          </div>
        </div>

        {/* Message Content */}
        {offer.message && (
          <p className="text-gray-700 text-xs italic">
            "{offer.message}"
          </p>
        )}
      </div>
    </div>
  );
};

export default BargainChatBubble;
