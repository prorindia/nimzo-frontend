import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// 🔑 Automatically attach token after login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("flashmart_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
