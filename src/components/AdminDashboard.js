
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  
  const [account, setAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error,setError] = useState("");
  const router = useRouter();
  

  const fetchAccounts = async () => {
    try {
      const res = await axios.post(BASE_URL + "/admin/account", {query:searchTerm},{
        withCredentials: true,
      });

      if (res.data.success) {
        setAccount(res.data.data);
       console.log(account);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      setError(err.message);
    }
  };
  useEffect(() => {
    if(searchTerm.length>0){
            fetchAccounts();
    }
    
  }, [searchTerm]);


     const handleAccount = async (partnerId) => {
    try {
      if (!partnerId) {
        setError("Invalid partner ID");
        return;
      }
  
      router.push(`/admin/partner/${partnerId}`);
    } catch (err) {
      console.error("Failed to access partner account:", err);
      setError(err.message);
    }
  };

  const handleClick = async ()=>{

       router.push("/admin/create/partner")
   
  }





  return (
    <div className="min-h-screen p-6 bg-gray-100 ">
       <div className="flex  justify-center relative">
             <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
        {account.length===0 &&( <button  onClick={handleClick} className="text-white absolute top-2 right-1 cursor-pointer bg-black  rounded-md px-5 py-2">create Account</button>)}
       </div>
     

  <div className="flex justify-center mb-4">
      <input
        type="text"
        placeholder="Search accounts by name or email"
        className=" px-4 py-2 border border-gray-300 rounded-tl-md rounded-bl-md w-[58vw] "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="text-white bg-black px-6 py-2 cursor-pointer">Search</div>
  </div>
      {searchTerm.length===0 && ( <div className="text-center">No accounts found</div>)}
    
      {error && <p className="text-red-400 texl-[30px] text-center">{error}</p>}
         
{account && searchTerm.length>0 &&(
  <div className="grid gap-4 mt-8 w-[58vw]  ">
    {account.map((acc, index) => {
      return (
        <div
          key={index}
          className="bg-white w-full ml-[18vw]  rounded-xl cursor-pointer shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          onClick={() => handleAccount(acc._id)} 
        >
          <h2 className="text-lg font-semibold text-gray-800"> partner name: {acc?.name}</h2>
          <p className="text-sm text-gray-600">emailId : {acc?.email}</p>
        </div>
      );
    })}
  </div>
)}

      
    </div>
  );
};

export default AdminDashboard;
