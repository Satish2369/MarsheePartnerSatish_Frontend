"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "@/redux/userSlice";
import { BASE_URL } from "@/utils/constant";


const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  console.log(user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!user || user.length===0) {
        try {
            
          console.log("No user found, fetching profile...");
          const res = await axios.get(`${BASE_URL}/profile`, {
            withCredentials: true,
          });

          console.log("profile fetched successfully");
          const userData = res?.data?.data;

          if (userData) {
            dispatch(addUser(userData));
            setLoading(false);
          } else {
            router.push("/login");
          }
        } catch (err) {
          router.push("/login");
        }
      } else {
        setLoading(false); 
      }
    };

    verifyUser();
  }, [user, dispatch, router]);


  // if (loading) return (
  //   <div className="h-screen w-full flex items-center justify-center">
  //     <div className="animate-pulse text-xl">Loading your profile...</div>
  //   </div>
  // );


  return children;
};

export default ProtectedRoute;
