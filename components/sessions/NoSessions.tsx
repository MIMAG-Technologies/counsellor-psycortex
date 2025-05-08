import React from 'react';

interface NoSessionsProps {
  status: string;
}

const NoSessions: React.FC<NoSessionsProps> = ({ status }) => {
  return (
    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
      <div className="text-center p-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-indigo-200 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="text-gray-600 font-medium">No {status} sessions found</p>
        <p className="text-gray-500 text-sm mt-1">Try changing your filters or check back later</p>
      </div>
    </div>
  );
};

export default NoSessions; 