import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore login from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  // 🔐 SEND OTP
  const sendOtp = async (phone) => {
    try {
      await API.post("/auth/send-otp", { phone });
      return true;
    } catch (err) {
      console.error("Send OTP error", err);
      return false;
    }
  };

  // 🔐 VERIFY OTP
  const verifyOtp = async (phone, otp) => {
    try {
      const res = await API.post("/auth/verify-otp", { phone, otp });

      const accessToken = res.data.access_token;

      localStorage.setItem("token", accessToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setToken(accessToken);

      return true;
    } catch (err) {
      console.error("Verify OTP error", err);
      return false;
    }
  };

  // 🔓 LOGOUT (SAFE — CART CLEAR REMOVED)
  const logout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
