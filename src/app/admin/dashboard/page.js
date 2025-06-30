import AdminDashboard from "@/components/AdminDashboard"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

const page = () => {
  return (
    <div>
      <AdminProtectedRoute>
        <AdminDashboard/>
      </AdminProtectedRoute>
    </div>
  )
}

export default page
