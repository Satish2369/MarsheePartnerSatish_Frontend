
import Dashboard from "@/components/Dashboard"
import ProtectedRoute from "@/components/ProtectedRoute"

const page = () => {

  return (

    <div>
      <ProtectedRoute>
            <Dashboard/>
      </ProtectedRoute>
      
    </div>
  )
}

export default page
