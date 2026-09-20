/**
 * Trust badges row and Newsletter signup strip.
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, MessageSquareQuote, Truck, Mail, Check } from 'lucide-react';
import Button from '../common/Button';

export const TrustBadges = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast.success(t('home.newsletter_title'));
      setEmail('');
    }
  };

  const badges = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-agri-primary" />,
      title: t('home.trust_1_title'),
      desc: t('home.trust_1_desc'),
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: t('home.trust_2_title'),
      desc: t('home.trust_2_desc'),
    },
    {
      icon: <MessageSquareQuote className="w-8 h-8 text-blue-600" />,
      title: t('home.trust_3_title'),
      desc: t('home.trust_3_desc'),
    },
    {
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      title: t('home.trust_4_title'),
      desc: t('home.trust_4_desc'),
    },
  ];

  return (
    <div className="space-y-6 my-8">
      {/* 4 Trust Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-agri-border shadow-xs flex items-start gap-3.5 hover:shadow-card transition"
          >
            <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">{b.icon}</div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{b.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup Banner */}
      <div className="bg-gradient-to-r from-agri-primary to-green-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="max-w-md text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Kisaan Weekly Bulletin</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            {t('home.newsletter_title')}
          </h3>
          <p className="text-xs text-green-100 mt-1">
            {t('home.newsletter_sub')}
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          {subscribed ? (
            <div className="bg-white text-agri-primary font-bold px-5 py-3 rounded-lg flex items-center justify-center gap-2 shadow-xs">
              <Check className="w-5 h-5" />
              <span>Subscribed Successfully!</span>
            </div>
          ) : (
            <>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('home.newsletter_placeholder')}
                className="px-4 py-2.5 rounded-lg text-xs text-gray-900 outline-none w-full sm:w-72 bg-white font-medium"
              />
              <Button type="submit" variant="accent" size="md">
                {t('home.newsletter_btn')}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default TrustBadges;
