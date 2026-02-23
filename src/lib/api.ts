import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
  withCredentials: false,
});

// Load persisted token on startup
const persisted = localStorage.getItem('bose_token');
if (persisted) {
  api.defaults.headers.common = api.defaults.headers.common || {} as any;
  (api.defaults.headers as any).common['Authorization'] = `Bearer ${persisted}`;
}

// Attach token per request (in case it changes during session)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bose_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('bose_token');
      if ((api.defaults.headers as any)?.common) {
        delete (api.defaults.headers as any).common['Authorization'];
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


