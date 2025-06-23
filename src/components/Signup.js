"use client"; 

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/navigation";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";
import { BASE_URL } from "@/utils/constant";

const Signup = () => {
 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

 const router = useRouter();
 const dispatch = useDispatch();


const handleSubmit = async (e) => {
    e.preventDefault();
  
    try{
         const res  = await axios.post(BASE_URL + "/signup",{name:fullName,email,password},{
         withCredentials:true });

           console.log(res.data.data);

           dispatch(addUser(res.data.data));
         
            router.push("/home");
    }
   catch(e){

     console.error(e.message);
   }
  
 
  };

  return (
    <div className="h-screen w-full bg-white text-black flex items-center justify-center relative overflow-hidden">
      {/* Left text */}
      <div className="px-12">
        <h2 className="text-6xl text-zinc-800 font-thin">Let&apos;s hear what</h2>
        <h2 className="text-6xl text-zinc-800 font-thin">pet don&apos;t say</h2>
      </div>

      {/* Right signup form */}
      <div className="w-1/2 flex justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 w-[360px]">
          <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
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
              Sign up
            </button>
          </form>

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
