

import {AdminCreatePartner} from "@/components/AdminCreatePartner"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

const page = () => {


  return (
    <div className="h-screen w-screen  flex justify-center items-center">
      <AdminProtectedRoute>
        <AdminCreatePartner/>
      </AdminProtectedRoute>
    </div>
  )
}

export default page;
