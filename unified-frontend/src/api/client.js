import axios from 'axios';

const getApiUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ) {
    if (envUrl && !envUrl.includes('localhost') && envUrl.startsWith('http')) {
      return envUrl.replace(/\/api\/?$/, '');
    }
    return '';
  }
  return envUrl.replace(/\/api\/?$/, '') || 'http://localhost:8000';
};

const API_URL = getApiUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiFormDataClient = axios.create({
  baseURL: API_URL,
  // Let the browser set the boundary for multipart/form-data
});
