/**
 * Custom hook for managing real-time bargaining sessions and counter-offers with FastAPI backend.
 * Zero mock fallback data — displays empty states when no sessions exist.
 */

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useBargainSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/bargain/sessions');
      if (res.data) {
        setSessions(res.data);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Error fetching bargain sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const startBargain = async (productId, offeredPrice, quantity = 1, message = '') => {
    try {
      const res = await api.post('/bargain/start', {
        product_id: productId,
        offered_price: Number(offeredPrice),
        quantity: Number(quantity),
        message,
      });
      toast.success('Bargain offer sent to seller!');
      await fetchSessions();
      return res.data;
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to start negotiation';
      toast.error(detail);
      throw err;
    }
  };

  const makeOffer = async (sessionId, offeredPrice, quantity, message) => {
    try {
      const res = await api.post('/bargain/offer', {
        session_id: sessionId,
        offered_price: Number(offeredPrice),
        quantity: quantity ? Number(quantity) : undefined,
        message,
      });
      toast.success('Counter offer submitted!');
      await fetchSessions();
      return res.data;
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to submit counter offer';
      toast.error(detail);
      throw err;
    }
  };

  const acceptBargain = async (sessionId) => {
    try {
      const res = await api.post(`/bargain/accept/${sessionId}`);
      toast.success('Deal accepted and locked!');
      await fetchSessions();
      return res.data;
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to accept offer';
      toast.error(detail);
      throw err;
    }
  };

  const rejectBargain = async (sessionId) => {
    try {
      const res = await api.post(`/bargain/reject/${sessionId}`);
      toast.success('Bargain session closed');
      await fetchSessions();
      return res.data;
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to close session';
      toast.error(detail);
      throw err;
    }
  };

  return {
    sessions,
    loading,
    refetch: fetchSessions,
    startBargain,
    makeOffer,
    acceptBargain,
    rejectBargain,
  };
};

export default useBargainSessions;
