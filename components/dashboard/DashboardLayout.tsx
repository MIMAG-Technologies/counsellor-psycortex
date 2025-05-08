import React from 'react';
import Sidebar from "../sidebar";
import Loader from '../loader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  loading = false,
  error = false,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        <div className="flex-grow flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-row bg-white min-h-screen">
        <div>
          <Sidebar />
        </div>
        <div className="ml-16 p-7 text-2xl text-gray-800 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">Failed to load data</div>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64 p-6 bg-white">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout; 