import axios from "axios";

const API = axios.create({
  // ✅ Vercel Environment Variable
  // Example: https://nimzo-backend.onrender.com
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// 🔑 Automatically attach token after login
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ SAME KEY EVERYWHERE
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
