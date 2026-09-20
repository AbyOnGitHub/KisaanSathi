/**
 * Bargain Session Card for negotiations list view.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquareQuote, ShoppingCart, ArrowRight, Clock } from 'lucide-react';
import BargainStatusBadge from './BargainStatusBadge';
import { formatPrice, timeAgo } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const BargainCard = ({ session }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const product = session.product || {};
  const seller = session.seller || {};
  const offers = session.offers || [];
  const latestOffer = offers.length > 0 ? offers[offers.length - 1] : null;

  const isMyTurn =
    session.status === 'open' &&
    latestOffer &&
    latestOffer.offered_by === (session.farmer_id === user?.id ? 'seller' : 'farmer');

  const handleAddToCartAtBargain = (e) => {
    e.preventDefault();
    if (session.settled_price) {
      addToCart(product, latestOffer?.quantity || 1, session.settled_price);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-agri-border p-4 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left: Product & Session Info */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <img
          src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=200&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-16 h-16 rounded-md object-cover border border-gray-200 flex-shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BargainStatusBadge status={session.status} isMyTurn={isMyTurn} />
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(session.created_at)}
            </span>
          </div>

          <Link
            to={`/products/${session.product_id}`}
            className="font-bold text-gray-900 text-sm hover:text-agri-primary truncate block"
          >
            {product.name || 'Agricultural Product'}
          </Link>

          <p className="text-xs text-gray-500 mt-0.5">
            {t('bargain.seller_label', { name: seller.business_name || seller.full_name || 'Agri Dealer' })}
          </p>

          <div className="flex items-center gap-3 text-xs mt-1.5 flex-wrap">
            <span>
              {t('bargain.original_listed', { price: formatPrice(session.original_price) })}
            </span>
            <span>
              {t('common.price')}:{' '}
              <strong className="text-agri-primary text-sm font-extrabold">
                {formatPrice(latestOffer?.offered_price || session.original_price)}
              </strong>
            </span>
            <span className="text-gray-400 text-[11px]">
              ({t('bargain.round_count', { current: offers.length, max: 10 })})
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {session.status === 'accepted' && session.settled_price && (
          <button
            onClick={handleAddToCartAtBargain}
            className="bg-agri-primary hover:bg-agri-dark text-white text-xs font-bold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('bargain.add_to_cart_settled', { price: formatPrice(session.settled_price) })}</span>
          </button>
        )}

        <Link
          to={`/bargains/${session.id}`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-md flex items-center gap-1 transition"
        >
          <MessageSquareQuote className="w-4 h-4 text-agri-primary" />
          <span>{t('common.details')}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default BargainCard;
