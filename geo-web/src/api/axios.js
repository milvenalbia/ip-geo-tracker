import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token'); // get token from Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
