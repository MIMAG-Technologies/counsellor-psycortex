'use client';
import { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaStar, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  
  return (
    <div className={`fixed h-screen bg-white shadow-lg ${isOpen ? "w-64" : "w-16"} transition-all duration-300 p-4`}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 mb-6">
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      
      <nav className="flex flex-col gap-6">
        <SidebarItem icon={<FaHome />} label="Dashboard" isOpen={isOpen} active={true} />
        <SidebarItem icon={<FaCalendarAlt />} label="Sessions" isOpen={isOpen} />
        <SidebarItem icon={<FaClock />} label="Schedule" isOpen={isOpen} />
        <SidebarItem icon={<FaUser />} label="Profile" isOpen={isOpen} />
        <SidebarItem icon={<FaStar />} label="Recommendations" isOpen={isOpen} />
      </nav>
    </div>
  );

};



type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
};



const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isOpen, active }) => {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg hover:bg-purple-200 cursor-pointer ${active ? 'bg-purple-100' : ''}`}>
      <span className="text-purple-600  text-xl">{icon}</span>
      {isOpen && <span className="text-gray-700 font-semibold">{label}</span>}
    </div>
  );
};

export default Sidebar;