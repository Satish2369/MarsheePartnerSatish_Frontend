"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import { addUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/utils/constant";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(BASE_URL + "/login", {email, password}, {
        withCredentials: true 
      });

      dispatch(addUser(res.data.data));
      router.push("/dashboard");
    }
    catch(e) {
      console.error(e);
      
      // Check if it's the admin login error
      if (e.response && e.response.data && e.response.data.message === "Please use admin login page") {
        setError("Admin users should use the admin login page");
        // Optionally, you could add a button or link to redirect to admin login
      } else {
        setError(e.response?.data?.message || "Login failed. Please check your credentials.");
      }
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
          <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
                {error === "Admin users should use the admin login page" && (
                  <div className="mt-2">
                    
                  </div>
                )}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-zinc-950 text-white py-2 rounded-md hover:bg-zinc-800"
            >
              Login
            </button>
          </form>
          
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
