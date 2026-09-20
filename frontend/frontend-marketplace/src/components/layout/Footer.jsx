/**
 * Multi-column commercial footer inspired by Flipkart & Amazon India.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#111827] text-gray-300 text-xs mt-16">
      {/* Top Value Strip */}
      <div className="border-b border-gray-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-900/40 text-agri-primary rounded-full border border-green-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t('footer.val_genuine_title')}</p>
              <p className="text-gray-400 text-xs">{t('footer.val_genuine_sub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-900/40 text-agri-accent rounded-full border border-amber-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t('footer.val_bargain_title')}</p>
              <p className="text-gray-400 text-xs">{t('footer.val_bargain_sub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-900/40 text-blue-400 rounded-full border border-blue-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t('footer.val_delivery_title')}</p>
              <p className="text-gray-400 text-xs">{t('footer.val_delivery_sub')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-900/40 text-purple-400 rounded-full border border-purple-800">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t('footer.val_helpline_title')}</p>
              <p className="text-gray-400 text-xs">{t('footer.val_helpline_sub')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Multi-Column Section */}
      <div className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              {t('footer.col_about')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">{t('footer.about_us')}</Link></li>
              <li><Link to="/products" className="hover:text-white transition">{t('footer.marketplace_catalog')}</Link></li>
              <li><Link to="/bargains" className="hover:text-white transition">{t('footer.how_bargaining_works')}</Link></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.wholesale')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.careers')}</a></li>
            </ul>
          </div>

          {/* Column 2: Help & Customer Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              {t('footer.col_help')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/orders" className="hover:text-white transition">{t('footer.track_order')}</Link></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.shipping_rates')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.returns_replacements')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.payment_options')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.helpdesk_faq')}</a></li>
            </ul>
          </div>

          {/* Column 3: Sell on AgriMart */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              {t('footer.col_make_money')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/seller/dashboard" className="text-agri-accent font-semibold hover:underline">{t('footer.seller_central_login')}</Link></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.sell_farm_inputs')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.dealer_verification')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.fulfillment')}</a></li>
              <li><a href="#" className="hover:text-white transition">{t('footer.advertise')}</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Regional Presence */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-gray-200">
              {t('footer.col_office')}
            </h4>
            <p className="text-gray-400 leading-relaxed mb-3">
              {t('footer.office_addr_1')}<br />
              {t('footer.office_addr_2')}<br />
              {t('footer.office_addr_3')}<br />
              {t('footer.office_cin')}
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>{t('footer.supported_payments')}</span>
              <span className="font-semibold text-white">{t('footer.payment_methods')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-gray-800 py-6 px-4 sm:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400">
          <p className="flex items-center gap-1">
            {t('footer.copyright')} <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">{t('footer.conditions_of_use')}</a>
            <a href="#" className="hover:text-white transition">{t('footer.privacy_notice')}</a>
            <a href="#" className="hover:text-white transition">{t('footer.interest_ads')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
