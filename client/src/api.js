import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // важное: нужны cookie (cc.sid)
});

// для удобства
export const get = (url, cfg) => api.get(url, cfg);
export const post = (url, data, cfg) => api.post(url, data, cfg);
export const del  = (url, cfg) => api.delete(url, cfg);

export default api;