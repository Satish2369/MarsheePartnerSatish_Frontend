"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";

const AdminProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        
        const res = await axios.get(`${BASE_URL}/admin/verify`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          setLoading(false);
        } else { 
           // If response is successful but indicates not admin
        
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Admin verification failed:", err);
        setError(err.response?.data?.message || "Authentication failed");
        router.push("/admin/login");
      }
    };

    verifyAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-xl">Verifying admin access...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;