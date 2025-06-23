
import Home from "@/components/Home"
import ProtectedRoute from "@/components/ProtectedRoute"

const page = () => {

  return (

    <div>
      <ProtectedRoute>
            <Home/>
      </ProtectedRoute>
      
    </div>
  )
}

export default page
