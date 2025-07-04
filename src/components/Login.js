"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";
import { BASE_URL } from "@/utils/constant";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/utils/firebase";

const Login = () => {
  const [tab, setTab] = useState("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (tab === "phone" && typeof window !== "undefined") {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (err) {}
        window.recaptchaVerifier = null;
      }

      setTimeout(() => {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });
        } catch (err) {
          console.error("reCAPTCHA error:", err.message);
        }
      }, 1000);
    }
  }, [tab]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(BASE_URL + "/login/email", { email, password }, { withCredentials: true });
      dispatch(addUser(res.data.data));
      router.push("/dashboard");
    } catch (e) {
      if (e.response?.data?.message === "Please use admin login page") {
        setError("Admin users should use the admin login page");
      } else {
        setError(e.response?.data?.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const formatted = phone.startsWith("+") ? phone : `+91${phone}`;

      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formatted, appVerifier);

      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpLogin = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      const firebaseUid = result.user.uid;

      const res = await axios.post(
        BASE_URL + "/login/phone",
        { phoneNumber: phone.startsWith("+") ? phone : `+91${phone}`, firebaseUid },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white text-black flex items-center justify-center relative overflow-hidden">
      <div className="px-12">
        <h2 className="text-6xl text-zinc-800 font-thin">Let&apos;s hear what</h2>
        <h2 className="text-6xl text-zinc-800 font-thin">pet don&apos;t say</h2>
      </div>

      <div className="w-1/2 flex justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 w-[360px]">
          <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

          <div className="flex justify-center mb-6 space-x-6 border-b pb-2">
            <button
              className={`text-sm px-3 py-1 ${tab === "email" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              onClick={() => setTab("email")}
            >
              Email
            </button>
            <button
              className={`text-sm px-3 py-1 ${tab === "phone" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
              onClick={() => {
                setTab("phone");
                setOtpSent(false);
              }}
            >
              Phone
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>
          )}

          {tab === "email" ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full bg-zinc-950 text-white py-2 rounded-md hover:bg-zinc-800"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtpLogin} className="space-y-4">
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={otpSent}
                required
              />
              {!otpSent && (
                <>
                  <div id="recaptcha-container" className="flex justify-center my-2" />
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-700"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}
              {otpSent && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-zinc-950 text-white py-2 rounded-md hover:bg-zinc-800"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                  <p
                    onClick={sendOtp}
                    className="text-xs text-blue-600 text-right mt-2 underline cursor-pointer"
                  >
                    Resend OTP
                  </p>
                </>
              )}
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-zinc-950 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
