// client/src/api.js
import axios from "axios";

/**
 * API base URL
 * - In production (Vercel), set VITE_API_URL = https://carcare-p3.onrender.com
 * - In dev, we fall back to http://localhost:4000
 */
const PROD_API = import.meta.env.VITE_API_URL || import.meta.env.VITE_API; // support either name
const BASE = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL_DEV || "http://localhost:4000")
  : PROD_API;

if (!BASE) {
  // Helpful warning if env is missing in Vercel
  // eslint-disable-next-line no-console
  console.warn(
    "[api] Missing VITE_API_URL. Requests may fail. Set it in Vercel project env."
  );
}

const api = axios.create({
  baseURL: String(BASE).replace(/\/+$/, ""), // trim trailing slash
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ========================= AUTH ========================= */

export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerRequest = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const meRequest = () => api.get("/auth/me");

export const logoutRequest = () => api.post("/auth/logout");

/* ========================= CARS ========================= */

export const createCar = (payload) => api.post("/cars", payload);

export const getCars = () => api.get("/cars");

export const deleteCar = (id) => api.delete(`/cars/${id}`);

export const uploadCarPhoto = (carId, file) => {
  const fd = new FormData();
  fd.append("file", file);
  // axios will set multipart boundary automatically if we don't force Content-Type
  return api.post(`/upload/car-photo/${carId}`, fd);
};

/* ========================= EXPENSES ========================= */

export const addExpense = (payload) => api.post("/expenses", payload);

export const listExpenses = (carId) => api.get(`/expenses`, { params: { carId } });

export const expensesSummary = (carId) => api.get(`/expenses/summary/${carId}`);

/* ========================= FORUM ========================= */

export const forumList = ({ q = "", skip = 0, limit = 20 } = {}) =>
  api.get("/forum/threads", { params: { q, skip, limit } });

export const forumCreate = ({ title, body, tags = [] }) =>
  api.post("/forum/threads", { title, body, tags });

export const forumGet = (id) => api.get(`/forum/threads/${id}`);

export const forumReply = (id, { body }) =>
  api.post(`/forum/threads/${id}/replies`, { body });

/* ========================= EXPORTS ========================= */

export { api };
export default api;
