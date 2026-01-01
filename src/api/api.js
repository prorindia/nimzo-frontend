import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "/api",
});

// 🔑 Automatically attach token after login
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ SAME KEY
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
