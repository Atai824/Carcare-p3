// client/src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ====== AUTH ======
export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerRequest = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const meRequest = () => api.get("/auth/me");
export const logoutRequest = () => api.post("/auth/logout");

// ====== CARS ======
export const createCar = (payload) => api.post("/cars", payload);
export const getCars = () => api.get("/cars");
export const deleteCar = (id) => api.delete(`/cars/${id}`);

export const uploadCarPhoto = (carId, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post(`/upload/car-photo/${carId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ====== EXPENSES ======
export const addExpense = (payload) => api.post("/expenses", payload);
export const listExpenses = (carId) => api.get(`/expenses?carId=${carId}`);
export const expensesSummary = (carId) => api.get(`/expenses/summary/${carId}`);

// ====== FORUM ======
export const forumList = ({ q = "", skip = 0, limit = 20 } = {}) =>
  api.get("/forum/threads", { params: { q, skip, limit } });

export const forumCreate = ({ title, body, tags = [] }) =>
  api.post("/forum/threads", { title, body, tags });

export const forumGet = (id) => api.get(`/forum/threads/${id}`);
export const forumReply = (id, { body }) =>
  api.post(`/forum/threads/${id}/replies`, { body });

// Экспорт по умолчанию и именованный — чтобы работали оба варианта импорта
export { api };
export default api;
