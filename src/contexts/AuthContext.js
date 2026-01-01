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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore login from localStorage (🔥 MOST IMPORTANT)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
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

      // ✅ SINGLE SOURCE OF TRUTH
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      return true;
    } catch (err) {
      console.error("Verify OTP error", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token, // 🔥 THIS FIXES CART / PROFILE ISSUE
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
