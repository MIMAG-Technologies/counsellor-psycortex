"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className={`fixed h-screen bg-white shadow-lg ${isOpen ? "w-64" : "w-16"} transition-all duration-300 p-4`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-indigo-500 hover:text-indigo-600 transition-colors mb-6"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <nav className="flex flex-col gap-3">
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
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-50 cursor-pointer group transition-colors"
      onClick={() => router.push(route)} 
    >
      <span className="text-indigo-500 text-xl group-hover:text-indigo-600 transition-colors">
        {icon}
      </span>
      {isOpen && (
        <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
          {label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;
