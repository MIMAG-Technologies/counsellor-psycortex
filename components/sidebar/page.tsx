"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  

  return (
    <div className={`fixed h-screen bg-gray-100 shadow-lg ${isOpen ? "w-64" : "w-16"} transition-all duration-300 p-4`}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 mb-6">
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <nav className="flex flex-col gap-5">
      
        <SidebarItem icon={<FaHome />} label="Dashboard" isOpen={isOpen} route="/dashboard" />

        <SidebarItem icon={<FaCalendarAlt />} label="Sessions" isOpen={isOpen} route="/sessions" />
        <SidebarItem icon={<FaClock />} label="Schedule" isOpen={isOpen} route="/schedule" />
        <SidebarItem icon={<FaUser />} label="Profile" isOpen={isOpen} route="/profile" />
        
      </nav>
    </div>
  );
};

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  route: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isOpen, route }) => {
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-4 p-3 rounded-lg bg-gray-200 hover:bg-purple-200 cursor-pointer"
      onClick={() => router.push(route)} 
    >
      <span className="text-purple-600 text-xl">{icon}</span>
      {isOpen && <span className="text-gray-700 font-semibold">{label}</span>}
    </div>
  );
};

export default Sidebar;
