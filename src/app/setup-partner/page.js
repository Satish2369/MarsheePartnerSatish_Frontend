"use client";

import { Suspense } from 'react';
import SetUpPartner from "@/components/SetUpPartner";

// Simple loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const page = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <SetUpPartner />
      </Suspense>
    </>
  )
}

export default page;

