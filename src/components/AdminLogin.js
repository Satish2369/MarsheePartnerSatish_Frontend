
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

     try{

      console.log(BASE_URL);
      const res = await axios.post(BASE_URL+"/admin/login",{email,password},{
        withCredentials:true
      })

       console.log(res.data);

       router.push("/admin-dashboard")

     }
     catch(e) {

        console.error(e.message);
        setError(e.message)
     }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

       

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          className="w-full border px-3 py-2 mb-4 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="w-full border px-3 py-2 mb-6 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full cursor-pointer bg-zinc-950 text-white py-2 rounded-md hover:bg-zinc-800"
        >
          Login
        </button>
      </form>
    </div>
  );
}
