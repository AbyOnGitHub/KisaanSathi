/**
 * Interactive Price Bargaining Modal.
 * Includes visual 50%-99% fair range slider, live validation, bulk quantity selector, and note.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { MessageSquareQuote, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import { useBargainSessions } from '../../hooks/useBargainSessions';

export const BargainModal = ({
  isOpen,
  onClose,
  product = null,
  onSuccess = null,
}) => {
  const { t } = useTranslation();
  if (!product) return null;

  const { startBargain } = useBargainSessions();
  const originalPrice = Number(product.price);
  const minAllowed = Math.round(originalPrice * 0.50);
  const maxAllowed = Math.round(originalPrice * 0.99);
  const defaultOffer = Math.round(originalPrice * 0.80);

  const [offeredPrice, setOfferedPrice] = useState(defaultOffer);
  const [quantity, setQuantity] = useState(product.min_order || 1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOfferedPrice(defaultOffer);
    setQuantity(product.min_order || 1);
    setMessage('');
  }, [product]);

  const discountFromOrig = Math.round(((originalPrice - offeredPrice) / originalPrice) * 100);
  const isTooLow = offeredPrice < minAllowed;
  const isTooHigh = offeredPrice > maxAllowed;
  const isValid = !isTooLow && !isTooHigh && offeredPrice > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await startBargain(product.id, offeredPrice, quantity, message);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      // Error toast is handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('bargain.modal_title')}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Product Summary Strip */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <img
            src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1594488518002-390919246193?w=100&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-12 h-12 rounded object-cover border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-xs truncate">{product.name}</h4>
            <p className="text-[11px] text-gray-500">
              {t('common.price')}: <strong className="text-gray-900">{formatPrice(originalPrice)}</strong> / {product.unit || 'unit'}
            </p>
          </div>
        </div>

        {/* Fair Range Slider Bar */}
        <div>
          <div className="flex items-center justify-between font-semibold text-gray-700 mb-1">
            <span>{t('bargain.fair_range')}</span>
            <span className="text-agri-primary font-bold">
              {formatPrice(minAllowed)} - {formatPrice(maxAllowed)}
            </span>
          </div>

          <input
            type="range"
            min={minAllowed}
            max={originalPrice}
            step={10}
            value={offeredPrice}
            onChange={(e) => setOfferedPrice(Number(e.target.value))}
            className="w-full accent-agri-primary cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>{t('bargain.min_50', { price: formatPrice(minAllowed) })}</span>
            <span>{t('bargain.listed', { price: formatPrice(originalPrice) })}</span>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Offer Price Input */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">{t('bargain.proposed_price')}</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                className={`w-full pl-7 pr-3 py-2 border rounded-md font-bold text-sm outline-none focus:ring-2 ${
                  isTooLow
                    ? 'border-red-400 text-red-600 focus:ring-red-200'
                    : 'border-gray-300 text-gray-900 focus:ring-green-200 focus:border-agri-primary'
                }`}
              />
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">{t('bargain.quantity_units', { unit: product.unit || 'unit' })}</label>
            <input
              type="number"
              min={product.min_order || 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-bold text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-agri-primary"
            />
          </div>
        </div>

        {/* Live Validation & Advice Banner */}
        {isTooLow ? (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{t('bargain.min_allowed_error', { price: formatPrice(minAllowed) })}</span>
          </div>
        ) : discountFromOrig >= 20 ? (
          <div className="p-2.5 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800">
            <Sparkles className="w-4 h-4 text-agri-primary flex-shrink-0" />
            <span>
              <Trans i18nKey="bargain.discount_tip" values={{ discount: discountFromOrig }}>
                You are requesting a <strong>{{discount: discountFromOrig}}% discount</strong>. Adding a note helps seller accept!
              </Trans>
            </span>
          </div>
        ) : (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-amber-800">
            <CheckCircle2 className="w-4 h-4 text-agri-accent flex-shrink-0" />
            <span>{t('bargain.competitive_tip')}</span>
          </div>
        )}

        {/* Note / Message Textarea */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            {t('bargain.note_seller')}
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('bargain.note_placeholder_modal')}
            className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-200 focus:border-agri-primary text-xs resize-none"
          />
        </div>

        {/* Rules & Trust Footer */}
        <div className="bg-gray-50 p-2.5 rounded text-[11px] text-gray-500 border border-gray-200 space-y-0.5">
          <p><Trans i18nKey="bargain.rule_rounds">• Up to <strong>10 negotiation rounds</strong> with seller.</Trans></p>
          <p><Trans i18nKey="bargain.rule_locked">• Accepted deals are locked and can be directly added to your cart.</Trans></p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="accent"
            isLoading={isSubmitting}
            disabled={!isValid}
            leftIcon={<MessageSquareQuote className="w-4 h-4" />}
          >
            {t('bargain.send_offer_for', { total: formatPrice(offeredPrice * quantity) })}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BargainModal;
