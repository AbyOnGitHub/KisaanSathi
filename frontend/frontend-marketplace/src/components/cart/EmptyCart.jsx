/**
 * Empty Cart State View with call-to-action to browse products.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import Button from '../common/Button';

export const EmptyCart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-agri-border p-12 text-center my-8 max-w-2xl mx-auto shadow-xs">
      <div className="w-20 h-20 bg-green-50 text-agri-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{t('cart.cart_empty_title')}</h2>
      <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
        {t('cart.cart_empty_desc')}
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/products')}
      >
        {t('cart.start_shopping_btn')}
      </Button>
    </div>
  );
};

export default EmptyCart;
