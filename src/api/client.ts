import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? '/v1';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((c) => {
  const t = localStorage.getItem('cv_admin_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use(
  (r) => r.data?.data ?? r.data,
  async (e) => {
    if (e.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(e.response?.data ?? e);
  }
);

export default api;
