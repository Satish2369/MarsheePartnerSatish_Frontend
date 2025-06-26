"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";
import Dashboard from "@/components/Dashboard"; 
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice"; 

const PartnerDashboardAdmin = () => {
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/partner/${partnerId}`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          setPartnerData(res.data.data);
          setEditedData(res.data.data); 
          dispatch(addUser(res.data.data));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch partner data:", err);
        setError("Failed to load partner data. You may not have permission.");
        setLoading(false);
      }
    };

    if (partnerId) {
      fetchPartnerData();
    }
  }, [partnerId, dispatch]);

  const handleBack = () => {
    router.push("/admin-dashboard");
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(partnerData);
    setUpdateMessage("");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/admin/partner/${partnerId}`, editedData, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        setPartnerData(res.data.data);
        setIsEditing(false);
        setUpdateMessage("Partner data updated successfully!");
        dispatch(addUser(res.data.data));  
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to update partner data:", err);
      setUpdateMessage("Failed to update partner data. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100">
        <button 
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Back to Admin Dashboard
        </button>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  // If not editing, show the partner's dashboard with an admin control panel
  if (!isEditing) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Admin Control Panel */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Back to Admin Dashboard
            </button>
            <h2 className="text-lg font-semibold">
              Viewing Partner: {partnerData.name} (Admin Mode)
            </h2>
          </div>
          <button 
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Edit Partner
          </button>
        </div>
        
        {updateMessage && (
          <div className="bg-green-100 text-green-700 p-3 m-4 rounded">
            {updateMessage}
          </div>
        )}
        {/* Render the partner's dashboard */}
        <Dashboard isAdminView={true} />
      </div>
    );
  }

  // If editing, show the edit form
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <button 
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Back to Admin Dashboard
      </button>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Partner: {partnerData.name}</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
        
        {updateMessage && (
          <div className={`p-3 mb-4 rounded ${updateMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {updateMessage}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={editedData.name || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={editedData.email || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={editedData.status || 'Active'}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Account Details (Not Editable)</h2>
            <p><strong>Account ID:</strong> {partnerData._id}</p>
            <p><strong>Role:</strong> {partnerData.role}</p>
            <p><strong>Joined:</strong> {new Date(partnerData.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PartnerDashboardAdmin;



