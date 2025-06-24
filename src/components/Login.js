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

  const router = useRouter();
  
   const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try{
         const res  =  await axios.post(BASE_URL + "/login",{email,password},{
         withCredentials:true })

      //  console.log(BASE_URL);
        

       dispatch(addUser(res.data.data));

       router.push("/home");

    
    }
   catch(e){

     console.error(e.message);
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-zinc-950 cursor-pointer hover:bg-zinc-800 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Sign in
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
