/**
 * Bargain Negotiations Hub Page.
 * Displays all user negotiation sessions grouped into Active, Accepted, and Closed tabs.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquareQuote, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import BargainCard from '../components/bargain/BargainCard';
import EmptyState from '../components/common/EmptyState';
import { useBargainSessions } from '../hooks/useBargainSessions';

export const BargainList = () => {
  const { t } = useTranslation();
  const { sessions } = useBargainSessions();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'accepted', 'closed'

  const activeSessions = sessions.filter((s) => s.status === 'open');
  const acceptedSessions = sessions.filter((s) => s.status === 'accepted');
  const closedSessions = sessions.filter((s) => ['rejected', 'expired', 'cancelled'].includes(s.status));

  const getFilteredSessions = () => {
    if (activeTab === 'active') return activeSessions;
    if (activeTab === 'accepted') return acceptedSessions;
    if (activeTab === 'closed') return closedSessions;
    return sessions;
  };

  const displayed = getFilteredSessions();

  const breadcrumbs = [
    { label: t('footer.marketplace_catalog'), href: '/products' },
    { label: t('nav.bargains') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 space-y-5">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('bargain.direct_price_neg')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {t('bargain.hub_title')}
          </h1>
          <p className="text-xs text-amber-100 mt-1">
            {t('bargain.hub_sub')}
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="bg-white rounded-lg border border-agri-border p-4">
        <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: t('bargain.tab_all', { count: sessions.length }) },
            { id: 'active', label: t('bargain.tab_active', { count: activeSessions.length }) },
            { id: 'accepted', label: t('bargain.tab_accepted', { count: acceptedSessions.length }) },
            { id: 'closed', label: t('bargain.tab_closed', { count: closedSessions.length }) },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-agri-accent text-gray-900 font-extrabold shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bargain Cards List */}
      {displayed.length === 0 ? (
        <EmptyState
          icon={<MessageSquareQuote className="w-12 h-12 text-gray-400" />}
          title={t('bargain.no_sessions_title')}
          description={t('bargain.no_sessions_desc')}
          actionText={t('bargain.browse_bargain_btn')}
          onAction={() => window.location.assign('/products?bargain_only=true')}
        />
      ) : (
        <div className="space-y-3">
          {displayed.map((session) => (
            <BargainCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BargainList;
