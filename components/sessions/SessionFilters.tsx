import React from 'react';
import { FaVideo, FaMessage } from 'react-icons/fa6';
import { SessionMode, SessionStatus } from '@/types/sessions';

interface SessionFiltersProps {
  activeMode: SessionMode | string;
  activeStatus: SessionStatus | string;
  onModeChange: (mode: string) => void;
  onStatusChange: (status: string) => void;
}

const SessionFilters: React.FC<SessionFiltersProps> = ({
  activeMode,
  activeStatus,
  onModeChange,
  onStatusChange
}) => {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-gray-700 font-medium">Mode:</h2>
          <div className="flex gap-2">
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeMode === "video" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onModeChange("video")}
            >
              <span><FaVideo className="text-md"/></span> Video
            </button>
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeMode === "chat" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onModeChange("chat")}
            >
              <span><FaMessage className="text-md"/></span> Chat
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-gray-700 font-medium">Status:</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeStatus === "upcoming" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onStatusChange("upcoming")}
            >
              Upcoming
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeStatus === "ongoing" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onStatusChange("ongoing")}
            >
              Ongoing
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeStatus === "completed" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onStatusChange("completed")}
            >
              Completed
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeStatus === "cancelled" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onStatusChange("cancelled")}
            >
              Cancelled
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                activeStatus === "expired" 
                  ? "bg-indigo-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onStatusChange("expired")}
            >
              Expired
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionFilters; 