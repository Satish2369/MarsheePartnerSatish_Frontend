import { IoPencilOutline } from "react-icons/io5";

const Onboard = () => {
  return (
    <div className="flex h-screen p-6 bg-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-100 p-6 rounded-lg flex flex-col">
        {/* Icon */}
        <div className=" flex justify-end cursor-pointer">
          <IoPencilOutline />
        </div>

        {/* Navigation */}
        <ul className="mt-20 space-y-6 text-lg font-light text-gray-800">
          <li className=" cursor-pointer">Onboarding</li>
          <li className=" cursor-pointer">Menu</li>
          <li className=" cursor-pointer">Orders</li>
          <li className=" cursor-pointer">Inventory</li>
          <li className=" cursor-pointer">Analytics</li>
          <li className=" cursor-pointer">Team</li>
          <li className=" cursor-pointer">Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-light text-gray-900">
          Partner Onboarding
        </h1>
      </main>
    </div>
  );
};

export default Onboard;
