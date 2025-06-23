

import Onboard from "@/components/Onboard"
import ProtectedRoute from "@/components/ProtectedRoute"


const page = () => {
  return (
    <div>

      <ProtectedRoute>
             <Onboard/>
      </ProtectedRoute>
        
 
    </div>
  )
}

export default page
