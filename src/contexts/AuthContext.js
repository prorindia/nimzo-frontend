import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}`;

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔁 Restore login from token (MOST IMPORTANT FIX) */
  useEffect(() => {
    const token = localStorage.getItem("flashmart_token");
    if (token) {
      setUser({ token }); // dummy user to keep auth state
    }
    setLoading(false);
  }, []);

  /* 🔐 SEND OTP */
  const sendOtp = async (phone) => {
    try {
      setLoading(true);
      await axios.post(`${API}/auth/send-otp`, { phone });
      return true;
    } catch (err) {
      console.error("Send OTP error", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* 🔐 VERIFY OTP */
  const verifyOtp = async (phone, otp) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/verify-otp`, { phone, otp });

      // ✅ SAVE TOKEN (CRITICAL)
      localStorage.setItem("flashmart_token", res.data.access_token);

      setUser(res.data.user || { token: res.data.access_token });
      return true;
    } catch (err) {
      console.error("Verify OTP error", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("flashmart_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendOtp,
        verifyOtp,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
