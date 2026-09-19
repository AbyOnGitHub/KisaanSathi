/**
 * Custom hook for fetching, filtering, and paginating products directly from the FastAPI backend.
 * Zero mock data fallback — returns empty array if no matching items found.
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [limit, setLimit] = useState(initialFilters.limit || 20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: filters.page || page,
        limit: filters.limit || limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.min_price && { min_price: filters.min_price }),
        ...(filters.max_price && { max_price: filters.max_price }),
        ...(filters.sort_by && { sort_by: filters.sort_by }),
      };

      const res = await api.get('/products/', { params });
      if (res.data?.data) {
        setProducts(res.data.data);
        setTotal(res.data.total ?? res.data.data.length);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
        setTotal(res.data.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Error fetching products from API:', err);
      setError(err.response?.data?.detail || 'Failed to load products');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProducts(initialFilters);
  }, [fetchProducts]);

  return {
    products,
    total,
    page,
    limit,
    setPage,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export default useProducts;
