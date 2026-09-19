/**
 * Bargain Session Status Badge.
 */

import React from 'react';

export const BargainStatusBadge = ({ status = 'open', isMyTurn = false }) => {
  const configs = {
    open: isMyTurn
      ? { label: '🟡 Your Turn', bg: 'bg-amber-100 text-amber-900 border-amber-300' }
      : { label: '🟢 Awaiting Response', bg: 'bg-blue-100 text-blue-900 border-blue-300' },
    accepted: { label: '✅ Deal Accepted', bg: 'bg-green-100 text-green-900 border-green-300 font-bold' },
    rejected: { label: '❌ Rejected', bg: 'bg-red-100 text-red-900 border-red-300' },
    expired: { label: '⏰ Expired', bg: 'bg-gray-100 text-gray-700 border-gray-300' },
    cancelled: { label: 'Cancelled', bg: 'bg-gray-100 text-gray-700 border-gray-300' },
  };

  const current = configs[status] || configs.open;

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${current.bg}`}>
      {current.label}
    </span>
  );
};

export default BargainStatusBadge;
