import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // ✅ single source of truth

const AuthPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("OTP AUTH PAGE LOADED");

  const sendOtp = async () => {
    if (phone.length !== 10) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/send-otp", {
        phone: phone, // backend mock ke liye +91 ki zarurat nahi
      });

      setStep("OTP");
    } catch (err) {
      console.error(err);
      setError("OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/verify-otp", {
        phone: phone,
        otp,
      });

      // ✅ SAME KEY EVERYWHERE
      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-xl font-bold text-center">Login</h2>

        {step === "PHONE" && (
          <>
            <input
              placeholder="Enter mobile number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-[#CCFF00] py-2 rounded font-bold"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "OTP" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-[#CCFF00] py-2 rounded font-bold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
