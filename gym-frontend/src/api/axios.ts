import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend adresin
  withCredentials: true,
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// On 401 remove token (so user gets redirected by UI guards on next navigation)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {}
    }
    return Promise.reject(err);
  },
);

export default api;
