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

  // 🔐 VERIFY OTP  ✅ FIX IS HERE
  const verifyOtp = async (phone, otp) => {
    try {
      const res = await API.post("/auth/verify-otp", { phone, otp });

      const accessToken = res.data.access_token; // 🔥 CORRECT KEY

      localStorage.setItem("token", accessToken);
      setToken(accessToken);

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
