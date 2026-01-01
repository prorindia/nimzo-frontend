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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore login from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // dummy user, enough for auth
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

      localStorage.setItem("token", res.data.token);
      setUser({ token: res.data.token });

      return true;
    } catch (err) {
      console.error("Verify OTP error", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
