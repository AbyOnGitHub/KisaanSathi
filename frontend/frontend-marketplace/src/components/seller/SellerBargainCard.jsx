/**
 * Seller Pending Bargain Request Card with quick counter-offer & accept actions.
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquareQuote, Check, X, ArrowRight, User } from 'lucide-react';
import Button from '../common/Button';
import { formatPrice, timeAgo } from '../../utils/formatters';
import api from '../../utils/api';

export const SellerBargainCard = ({ session, onActionDone }) => {
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMsg, setCounterMsg] = useState('');
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const product = session.product || {};
  const farmer = session.farmer || {};
  const offers = session.offers || [];
  const latestOffer = offers.length > 0 ? offers[offers.length - 1] : null;

  const originalPrice = Number(session.original_price || product.price || 0);
  const offeredPrice = Number(latestOffer?.offered_price || 0);
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - offeredPrice) / originalPrice) * 100) : 0;

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await api.post(`/bargain/accept/${session.id}`);
      toast.success('Bargain offer accepted!');
      if (onActionDone) onActionDone();
    } catch {
      toast.error('Failed to accept bargain');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await api.post(`/bargain/reject/${session.id}`);
      toast.success('Bargain rejected');
      if (onActionDone) onActionDone();
    } catch {
      toast.error('Failed to reject bargain');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendCounter = async (e) => {
    e.preventDefault();
    if (!counterPrice || Number(counterPrice) <= 0) {
      toast.error('Please enter a valid counter price');
      return;
    }

    setIsProcessing(true);
    try {
      await api.post('/bargain/offer', {
        session_id: session.id,
        offered_price: Number(counterPrice),
        quantity: latestOffer?.quantity || 1,
        message: counterMsg || 'Counter offer from seller',
      });
      toast.success('Counter-offer sent to farmer!');
      setShowCounterInput(false);
      if (onActionDone) onActionDone();
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to send counter-offer';
      toast.error(detail);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-agri-border p-4 shadow-xs hover:shadow-md transition text-xs space-y-3">
      {/* Top Header: Buyer & Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 text-agri-primary rounded-full">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-gray-900 block">{farmer.full_name || 'Farmer Buyer'}</span>
            <span className="text-[10px] text-gray-400">{timeAgo(session.created_at)}</span>
          </div>
        </div>
        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          Round {offers.length}/10
        </span>
      </div>

      {/* Product Summary & Price Comparison */}
      <div className="p-2.5 bg-gray-50 rounded-md flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <span className="font-semibold text-gray-900 truncate block">{product.name}</span>
          <span className="text-[11px] text-gray-500">
            Qty requested: <strong>{latestOffer?.quantity || 1} {product.unit || 'units'}</strong>
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-400 line-through text-[11px] block">{formatPrice(originalPrice)}</span>
          <span className="text-sm font-black text-agri-primary">{formatPrice(offeredPrice)}</span>
          <span className="text-[10px] font-bold text-red-600 block">(-{discountPercent}%)</span>
        </div>
      </div>

      {/* Buyer's Message */}
      {latestOffer?.message && (
        <p className="text-[11px] text-gray-600 italic bg-amber-50/50 p-2 rounded border border-amber-100">
          "{latestOffer.message}"
        </p>
      )}

      {/* Counter Offer Input Box (if opened) */}
      {showCounterInput ? (
        <form onSubmit={handleSendCounter} className="p-3 bg-green-50 rounded-md border border-green-200 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                required
                placeholder="Counter Price"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-xs outline-none bg-white font-bold text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-agri-primary hover:bg-agri-dark text-white font-bold px-3 py-1.5 rounded text-xs transition"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => setShowCounterInput(false)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Optional message (e.g. Free delivery included at this price)"
            value={counterMsg}
            onChange={(e) => setCounterMsg(e.target.value)}
            className="w-full px-2.5 py-1 border border-gray-300 rounded text-[11px] outline-none bg-white"
          />
        </form>
      ) : (
        /* Action Buttons */
        <div className="grid grid-cols-3 gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            isLoading={isProcessing}
            onClick={handleAccept}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Accept
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={() => setShowCounterInput(true)}
            leftIcon={<MessageSquareQuote className="w-3.5 h-3.5" />}
          >
            Counter
          </Button>

          <Button
            variant="secondary"
            size="sm"
            isLoading={isProcessing}
            onClick={handleReject}
            leftIcon={<X className="w-3.5 h-3.5" />}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerBargainCard;
