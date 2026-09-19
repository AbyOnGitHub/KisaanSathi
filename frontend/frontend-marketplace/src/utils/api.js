/**
 * Axios API client configuration with Supabase JWT authentication interceptor.
 * Injects the active session Bearer token into all outgoing requests.
 */

import axios from 'axios';
import toast from 'react-hot-toast';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Supabase JWT session token to Authorization header
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn('Could not extract Supabase auth token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    const status = error.response?.status;

    if (status === 401) {
      console.warn('Unauthorized request - session may have expired.');
    } else if (status === 403) {
      toast.error(detail || 'Access forbidden: Insufficient permissions');
    } else if (status >= 500) {
      toast.error(detail || 'Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
