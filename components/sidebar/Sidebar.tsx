'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaUserEdit
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

interface Route {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const routes: Route[] = [
  { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
  { path: "/sessions", label: "Sessions", icon: <FaCalendarAlt /> },
  { path: "/schedule", label: "Schedule", icon: <FaClock /> },
  { path: "/profile", label: "Profile", icon: <FaUser /> },
  { path: "/edit-profile", label: "Edit Profile", icon: <FaUserEdit /> }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  // Set sidebar open by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-20
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"} 
        `}
      >
        <div className="p-4">
          {/* Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-indigo-500 hover:text-indigo-600 transition-colors mb-6 w-full flex justify-center md:justify-start"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {routes.map((route) => (
              <SidebarItem
                key={route.path}
                icon={route.icon}
                label={route.label}
                isOpen={isOpen}
                route={route.path}
                isActive={pathname === route.path}
              />
            ))}

            {/* Logout button */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center gap-4 p-3 rounded-lg
                  hover:bg-red-50 text-red-500 hover:text-red-600
                  transition-colors cursor-pointer
                `}
              >
                <span className="text-xl">
                  <FaSignOutAlt />
                </span>
                {isOpen && (
                  <span className="font-medium">
                    Logout
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile toggle button (fixed at bottom) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-30 bg-indigo-500 text-white p-3 rounded-full shadow-lg"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  route: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isOpen,
  route,
  isActive
}) => {
  const router = useRouter();

  return (
    <div
      className={`
        flex items-center gap-4 p-3 rounded-lg cursor-pointer
        transition-colors
        ${isActive
          ? "bg-indigo-50 text-indigo-600"
          : "hover:bg-gray-100 text-gray-700 hover:text-indigo-600"}
      `}
      onClick={() => router.push(route)}
    >
      <span className="text-xl flex-shrink-0">
        {icon}
      </span>
      {isOpen && (
        <span className="font-medium truncate">
          {label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;