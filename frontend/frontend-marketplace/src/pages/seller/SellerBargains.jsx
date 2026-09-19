/**
 * Seller Pending Bargains Tab.
 * Grid of buyer negotiation requests awaiting the seller's response with counter-offer inputs.
 * Connected directly to FastAPI GET /bargain/seller/pending.
 */

import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import SellerBargainCard from '../../components/seller/SellerBargainCard';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

export const SellerBargains = () => {
  const [pendingSessions, setPendingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBargains = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bargain/seller/pending');
      if (res.data) {
        setPendingSessions(res.data);
      } else {
        setPendingSessions([]);
      }
    } catch (err) {
      console.error('Error fetching pending seller bargains:', err);
      setPendingSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBargains();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-agri-border p-5 space-y-4 shadow-xs text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base font-black text-gray-900 flex items-center gap-1.5">
            <MessageSquareQuote className="w-5 h-5 text-amber-600" />
            <span>Buyer Bargain Requests ({pendingSessions.length})</span>
          </h2>
          <p className="text-xs text-gray-500">
            Incoming customer price proposals awaiting your approval or counter-offer
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Checking for incoming price negotiations...</span>
        </div>
      ) : pendingSessions.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-12 h-12 text-agri-primary" />}
          title="All caught up!"
          description="You have responded to all incoming price negotiations."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingSessions.map((session) => (
            <SellerBargainCard
              key={session.id}
              session={session}
              onActionDone={fetchPendingBargains}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerBargains;
