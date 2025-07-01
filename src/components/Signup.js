"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";
import { BASE_URL } from "@/utils/constant";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/utils/firebase";

const Signup = () => {
  const [tab, setTab] = useState("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // Setup reCAPTCHA safely
  useEffect(() => {
    if (typeof window !== "undefined" && tab === "phone" && !otpSent) {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        window.recaptchaVerifier = null;
      }

      // Wait for the DOM to update and recaptcha-container to be present
      const timer = setTimeout(() => {
        const recaptchaDiv = document.getElementById("recaptcha-container");
        if (recaptchaDiv && !window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
              size: "invisible",
              callback: () => {},
            });
          } catch (err) {
            console.error("Recaptcha init failed:", err.message);
          }
        }
      }, 100); // Short delay to ensure DOM is updated

      return () => {
        clearTimeout(timer);
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch {}
          window.recaptchaVerifier = null;
        }
      };
    }
  }, [tab, otpSent]);

  const formatPhone = (number) => {
    const digits = number.replace(/\D/g, "");
    return digits.startsWith("91") ? `+${digits}` : `+91${digits}`;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/signup/email`,
        { name: fullName, email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);
      const formatted = formatPhone(phone);
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formatted, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP");

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        window.recaptchaVerifier = null;
      }

      setTimeout(() => {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });
        } catch (retryErr) {
          console.error("Retry Recaptcha failed:", retryErr.message);
        }
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e) => {
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
        `${BASE_URL}/signup/phone`,
        {
          name: fullName,
          phoneNumber: formatPhone(phone),
          firebaseUid,
        },
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
          <h2 className="text-3xl font-semibold mb-4 text-center">Signup</h2>

          <div className="flex justify-center mb-6 space-x-6 border-b pb-2">
            <button
              className={`text-sm px-3 py-1 ${
                tab === "email" ? "border-b-2 border-black font-semibold" : "text-gray-500"
              }`}
              onClick={() => setTab("email")}
            >
              Email
            </button>
            <button
              className={`text-sm px-3 py-1 ${
                tab === "phone" ? "border-b-2 border-black font-semibold" : "text-gray-500"
              }`}
              onClick={() => {
                setTab("phone");
                setOtpSent(false);
                setError("");
              }}
            >
              Phone
            </button>
          </div>

          {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded-md text-sm">{error}</div>}

          {tab === "email" ? (
            <form className="space-y-4" onSubmit={handleEmailSignup}>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-2 rounded-md transition duration-200"
              >
                {loading ? "Processing..." : "Sign up"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handlePhoneSignup}>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                required
                disabled={otpSent}
              />

              {!otpSent && (
                <>
                  <div id="recaptcha-container" className="flex justify-center my-2" />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-zinc-900 hover:bg-zinc-700 text-white font-semibold py-2 rounded-md transition duration-200"
                  >
                    {loading ? "Sending..." : "Send OTP"}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-2 rounded-md transition duration-200"
                  >
                    {loading ? "Verifying..." : "Verify & Sign up"}
                  </button>
                  <p
                    onClick={handleSendOtp}
                    className="text-xs text-blue-600 text-right mt-2 underline cursor-pointer"
                  >
                    Resend OTP
                  </p>
                </>
              )}
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-950 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
