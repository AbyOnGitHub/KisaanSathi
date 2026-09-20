/**
 * Custom hook for fetching, filtering, and paginating products directly from the FastAPI backend.
 * Zero mock data fallback — returns empty array if no matching items found.
 * Fully reactive to URL search query parameters and filter changes.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    search = '',
    category = '',
    min_price = null,
    max_price = null,
    sort_by = 'created_at',
    page = 1,
    limit = 20,
  } = filters;

  const currentRequestId = useRef(0);

  const fetchProducts = useCallback(async (overrideFilters = null) => {
    const activeFilters = overrideFilters !== null ? overrideFilters : {
      search,
      category,
      min_price,
      max_price,
      sort_by,
      page,
      limit,
    };

    const reqId = ++currentRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: activeFilters.page || 1,
        limit: activeFilters.limit || 20,
        ...(activeFilters.category && { category: activeFilters.category }),
        ...(activeFilters.search && activeFilters.search.trim() && { search: activeFilters.search.trim() }),
        ...(activeFilters.min_price !== null && activeFilters.min_price !== undefined && activeFilters.min_price !== '' && { min_price: Number(activeFilters.min_price) }),
        ...(activeFilters.max_price !== null && activeFilters.max_price !== undefined && activeFilters.max_price !== '' && { max_price: Number(activeFilters.max_price) }),
        ...(activeFilters.sort_by && { sort_by: activeFilters.sort_by }),
      };

      const res = await api.get('/products/', { params });

      // Only update state if this is the most recent request
      if (reqId === currentRequestId.current) {
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
      }
    } catch (err) {
      if (reqId === currentRequestId.current) {
        console.error('Error fetching products from API:', err);
        setError(err.response?.data?.detail || 'Failed to load products');
        setProducts([]);
        setTotal(0);
      }
    } finally {
      if (reqId === currentRequestId.current) {
        setLoading(false);
      }
    }
  }, [search, category, min_price, max_price, sort_by, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    total,
    page,
    limit,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export default useProducts;
