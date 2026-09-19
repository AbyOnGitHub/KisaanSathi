/**
 * Real-time Bargain Chat Detail Page.
 * WhatsApp-style negotiation console with turn validation, counter-offers, and deal acceptance.
 * Purely backend-driven.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MessageSquareQuote,
  Check,
  X,
  ShoppingCart,
  Clock,
  Send,
  AlertCircle,
  Tag,
  Store,
} from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import BargainChatBubble from '../components/bargain/BargainChatBubble';
import BargainStatusBadge from '../components/bargain/BargainStatusBadge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice, timeAgo } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useBargainSessions } from '../hooks/useBargainSessions';
import api from '../utils/api';

export const BargainDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const { makeOffer, acceptBargain, rejectBargain } = useBargainSessions();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMsg, setCounterMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSession = async () => {
    setError(null);
    try {
      const res = await api.get(`/bargain/session/${sessionId}`);
      if (res.data) setSession(res.data);
    } catch (err) {
      console.error('Error loading bargain session:', err);
      setError(err.response?.data?.detail || 'Negotiation session not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-semibold">Loading negotiation session...</span>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-gray-400" />}
          title="Negotiation Not Found"
          description={error || "This bargaining session does not exist or you do not have permission to view it."}
          actionText="View Your Bargains"
          onAction={() => navigate('/bargains')}
        />
      </div>
    );
  }

  const product = session.product || {};
  const seller = session.seller || {};
  const offers = session.offers || [];
  const latestOffer = offers.length > 0 ? offers[offers.length - 1] : null;

  const isFarmer = session.farmer_id === user?.id || profile?.role === 'farmer';
  const isMyTurn =
    session.status === 'open' &&
    latestOffer &&
    latestOffer.offered_by === (isFarmer ? 'seller' : 'farmer');

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!counterPrice || Number(counterPrice) <= 0) {
      toast.error('Please enter a valid price offer');
      return;
    }

    setIsSubmitting(true);
    try {
      await makeOffer(session.id, counterPrice, latestOffer?.quantity || 1, counterMsg);
      setCounterPrice('');
      setCounterMsg('');
      await fetchSession();
    } catch {
      // Handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptDeal = async () => {
    setIsSubmitting(true);
    try {
      await acceptBargain(session.id);
      await fetchSession();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectDeal = async () => {
    setIsSubmitting(true);
    try {
      await rejectBargain(session.id);
      await fetchSession();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCartSettled = () => {
    if (session.settled_price) {
      addToCart(product, latestOffer?.quantity || 1, session.settled_price);
    }
  };

  const breadcrumbs = [
    { label: 'Marketplace', href: '/products' },
    { label: 'Bargains', href: '/bargains' },
    { label: `Negotiation #${session.id.slice(0, 8)}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3 space-y-4">
      <Breadcrumbs items={breadcrumbs} />

      {/* Top Product Summary & Status Banner */}
      <div className="bg-white rounded-xl border border-agri-border p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=200&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-16 h-16 rounded-md object-cover border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BargainStatusBadge status={session.status} isMyTurn={isMyTurn} />
              <span className="text-[11px] text-gray-500 font-bold">
                Round {offers.length} of 10
              </span>
            </div>
            <Link
              to={`/products/${session.product_id}`}
              className="font-bold text-gray-900 text-sm hover:text-agri-primary block"
            >
              {product.name}
            </Link>
            <p className="text-xs text-gray-500">
              Original Listed: <span className="line-through">{formatPrice(session.original_price)}</span> • Seller: <strong className="text-gray-700">{seller.business_name || seller.full_name || 'Agri Supplier'}</strong>
            </p>
          </div>
        </div>

        {session.status === 'accepted' && session.settled_price && (
          <Button
            variant="accent"
            size="md"
            onClick={handleAddToCartSettled}
            leftIcon={<ShoppingCart className="w-4 h-4" />}
          >
            Add to Cart at {formatPrice(session.settled_price)}
          </Button>
        )}
      </div>

      {/* WhatsApp-Style Negotiation Chat Feed */}
      <div className="bg-[#f8fafc] rounded-xl border border-agri-border p-4 sm:p-6 min-h-[350px] max-h-[500px] overflow-y-auto space-y-3 shadow-inner">
        {/* Deal Started Banner */}
        <div className="text-center py-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
            Negotiation Started • {timeAgo(session.created_at)}
          </span>
        </div>

        {/* Chat Bubbles */}
        {offers.map((offer) => (
          <BargainChatBubble
            key={offer.id}
            offer={offer}
            isCurrentUser={isFarmer ? offer.offered_by === 'farmer' : offer.offered_by === 'seller'}
          />
        ))}

        {/* Deal Settled Box */}
        {session.status === 'accepted' && session.settled_price && (
          <div className="p-4 bg-green-100 border border-green-300 rounded-xl text-center text-green-900 my-4 shadow-xs">
            <h3 className="font-extrabold text-sm sm:text-base">
              🎉 Congratulations! Price settled and deal locked at {formatPrice(session.settled_price)}
            </h3>
            <p className="text-xs text-green-800 mt-1">
              You can now add this quantity to your shopping cart at this exclusive agreed price.
            </p>
          </div>
        )}

        {/* Deal Rejected Box */}
        {session.status === 'rejected' && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-xl text-center text-red-900 my-4 shadow-xs">
            <h3 className="font-bold text-sm">
              Negotiation closed without an agreement.
            </h3>
            <p className="text-xs text-red-700 mt-0.5">
              You can explore other products or restart with a different offer.
            </p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions & Counter-Offer Box (If Open) */}
      {session.status === 'open' && (
        <div className="bg-white rounded-xl border border-agri-border p-4 shadow-md space-y-3">
          {/* Latest Offer Action Strip */}
          {latestOffer && isMyTurn && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-amber-950 block text-xs">
                  Latest Offer from Counterparty: <strong className="text-agri-primary text-sm font-black">{formatPrice(latestOffer.offered_price)}</strong>
                </span>
                <span className="text-[11px] text-amber-800">
                  Accept to finalize deal or send a counter-offer below.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={handleAcceptDeal}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Accept {formatPrice(latestOffer.offered_price)}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={handleRejectDeal}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Reject & Close
                </Button>
              </div>
            </div>
          )}

          {/* Counter Offer Form */}
          <form onSubmit={handleSendOffer} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative w-44">
                <span className="absolute left-3 top-2.5 text-gray-500 font-bold text-xs">₹</span>
                <input
                  type="number"
                  required
                  placeholder="Counter Price"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-agri-primary bg-white"
                />
              </div>

              <input
                type="text"
                placeholder="Add a message for counterparty (e.g. Can purchase immediately)..."
                value={counterMsg}
                onChange={(e) => setCounterMsg(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-agri-primary bg-white"
              />

              <Button
                type="submit"
                variant="accent"
                size="md"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Offer
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BargainDetail;
