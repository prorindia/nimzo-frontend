import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

/* ✅ hook */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/* ✅ provider */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔁 Restore login from token (MOST IMPORTANT FIX) */
  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ SAME KEY
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /* 🔐 SEND OTP */
  const sendOtp = async (phone) => {
    try {
      await API.post("/auth/send-otp", { phone });
      return true;
    } catch (err) {
      console.error("Send OTP error", err);
      return false;
    }
  };

  /* 🔐 VERIFY OTP */
  const verifyOtp = async (phone, otp) => {
    try {
      const res = await API.post("/auth/verify-otp", { phone, otp });

      // ✅ SAVE TOKEN (ONE & ONLY KEY)
      localStorage.setItem("token", res.data.token);

      setIsAuthenticated(true); // 🔥 THIS FIXES CART/PROFILE
      return true;
    } catch (err) {
      console.error("Verify OTP error", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
