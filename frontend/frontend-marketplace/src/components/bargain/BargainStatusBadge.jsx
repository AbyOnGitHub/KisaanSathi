/**
 * Bargain Session Status Badge.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

export const BargainStatusBadge = ({ status = 'open', isMyTurn = false }) => {
  const { t } = useTranslation();

  const configs = {
    open: isMyTurn
      ? { label: t('bargain.status_your_turn'), bg: 'bg-amber-100 text-amber-900 border-amber-300' }
      : { label: t('bargain.status_awaiting_response'), bg: 'bg-blue-100 text-blue-900 border-blue-300' },
    accepted: { label: t('bargain.status_deal_accepted'), bg: 'bg-green-100 text-green-900 border-green-300 font-bold' },
    rejected: { label: t('bargain.status_rejected'), bg: 'bg-red-100 text-red-900 border-red-300' },
    expired: { label: t('bargain.status_expired'), bg: 'bg-gray-100 text-gray-700 border-gray-300' },
    cancelled: { label: t('bargain.status_cancelled'), bg: 'bg-gray-100 text-gray-700 border-gray-300' },
  };

  const current = configs[status] || configs.open;

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${current.bg}`}>
      {current.label}
    </span>
  );
};

export default BargainStatusBadge;

