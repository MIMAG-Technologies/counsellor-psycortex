import React, { ReactNode } from 'react';
import Sidebar from '../sidebar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isChatRoute = /^\/sessions\/chat_[^/]+\/chat$/.test(pathname || '');
  return (
    <div className="flex min-h-screen bg-white">
      {!isChatRoute && <Sidebar />}
      <div className={`flex-1 ${!isChatRoute ? 'ml-16 md:ml-64' : ''} p-4 md:p-6 lg:p-8 overflow-auto`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 