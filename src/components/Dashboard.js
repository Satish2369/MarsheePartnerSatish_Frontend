"use client";
import { useState } from "react";
import { LiaExpandSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { GiContract } from "react-icons/gi";
import axios from "axios";
import { BASE_URL } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { removeUser } from "@/redux/userSlice";

const Dashboard = ({ isAdminView = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const user = useSelector((store)=>store?.user);
  const userName = user[0]?.name;
  const progressPercent = sidebarOpen ? 20 : 80;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progressPercent / 100);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    try {
    
      if (isAdminView) {
        return;
      }

      const res = axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

      dispatch(removeUser());
      router.push("/login");
      console.log("logout successfully");
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-black p-6 gap-4">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-[20vw]" : "w-[4vw]"
        } bg-gray-100 p-4 rounded-lg`}
      >
        <button onClick={toggleSidebar} className="flex w-full justify-end ">
          {sidebarOpen ? (
            <GiContract className="text-gray-600 cursor-pointer" size={28} />
          ) : (
            <LiaExpandSolid
              size={20}
              className="text-gray-600 cursor-pointer"
            />
          )}
        </button>

        {sidebarOpen ? (
          <div>
            <div className="text-[20px] mt-[3vw] ml-2 text-left">
              Hello {userName}!
              {isAdminView && <span className="text-sm text-blue-500 block">(Admin View)</span>}
            </div>
            <ul className="mt-[6vw] space-y-2 text-sm ml-2 text-left text-black font-thin cursor-pointer">
              <li>Onboarding</li>
              <li>Menu</li>
              <li>Orders</li>
              <li>Inventory</li>
              <li>Analytics</li>
              <li>Team</li>
              <li>Settings</li>
            </ul>
            {!isAdminView && (
              <span
                className="inline-block cursor-pointer mt-4 text-sm bg-black py-2 px-6 rounded-md text-white"
                onClick={handleLogOut}
              >
                Logout
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-[6vw] ">
            {new Array(7).fill().map((_, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-gray-200"
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-6 transition-all duration-300 w-full">
        
        <div
          className={`flex flex-col gap-6 ${
            sidebarOpen ? "w-full" : "w-[80%]"
          } transition-all duration-300`}
        >
         
          <div className="bg-gray-100 p-6 rounded-lg h-[15vw]">
            <div className="m-[2vw]">
              <h2 className="text-4xl font-light">A dashboard to hear</h2>
              <h2 className="text-4xl font-light">what pets don&apos;t say</h2>
            </div>
          </div>

          <div className="   rounded-xl flex  justify-between  gap-2 flex-1 ">
              <div className="bg-gray-100  flex  justify-center items-center gap-6 flex-1  min-w-[15vw] h-[15vw]">
                     <div className=" flex flex-col text-xl font-thin">
                        <h2>Petcare Partner</h2>
                        <h2>Onboarding</h2>
                    </div>

            <div  className=" ">
                   <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="#22c55e"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-green-600">
                {progressPercent}%
              </div>
            </div>

              <p className="text-sm text-black font-thin text-center ">
              {progressPercent === 80 ? "Completed" : "Onboarding Left"}
              </p>
            </div>
        
              </div>
              <div className="bg-zinc-100  flex-1 min-w-[15vw] h-[15vw]">
              </div>
                 
          </div>
        </div>

        {!sidebarOpen && (
          <div className="w-[20%] flex flex-col gap-4 transition-all duration-300">
            <div className="flex items-center gap-3 bg-gray-100 h-[3vw] rounded-lg px-4">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <div className="text-sm font-thin">Updated 2s ago</div>
            </div>

            <div className="bg-gray-100 flex-1 rounded-lg p-4 flex justify-between items-start">
              <p className="text-xl font-thin">Notifications</p>
              <div className="w-4 h-4 rounded-full bg-green-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
