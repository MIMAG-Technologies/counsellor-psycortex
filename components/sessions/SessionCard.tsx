import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendar } from 'react-icons/fa';
import { Session } from '@/types/sessions';
import { formatDuration, formatStatus } from '@/utils/sessions/index';

interface SessionCardProps {
  session: Session;
  activeMode: string;
  activeStatus: string;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  activeMode, 
  activeStatus 
}) => {
  const router = useRouter();
  const sessionDate = new Date(session.scheduledAt);
  
  const formattedDate = sessionDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const formattedTime = sessionDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Calculate actual session duration
  let actualDurationText = "Not available";
  if (session.startedAt && session.endedAt) {
    const startTime = new Date(session.startedAt);
    const endTime = new Date(session.endedAt);
    
    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
      if (endTime > startTime) {
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationMinutes = Math.round(durationMs / (1000 * 60));
        actualDurationText = formatDuration(durationMinutes);
      } else {
        actualDurationText = formatDuration(session.duration || 0);
      }
    }
  } else if (session.actualDuration && session.actualDuration > 0) {
    actualDurationText = formatDuration(session.actualDuration);
  } else {
    actualDurationText = formatDuration(session.duration || 0);
  }

  const handleClick = () => {
    router.push(`/sessions/details?sessionId=${session.id}&userId=${session.user.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border-2 border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="bg-indigo-50 p-3 flex justify-between items-center border-b border-indigo-100">
        <div className="flex items-center">
          <span className="text-indigo-500 mr-2">
            <FaCalendar />
          </span>
          <span className="text-gray-700 font-medium text-sm">
            {formattedDate} at {formattedTime}
          </span>
        </div>
        <span className="bg-indigo-500 text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
          {formatStatus(session.status)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center">
          {session.user && session.user.image ? (
            <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden">
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    session.user.name || "User"
                  )}&color=4F46E5&background=EEF2FF`;
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <span className="text-indigo-500 text-lg font-medium">
                {session.user && session.user.name
                  ? session.user.name.charAt(0)
                  : "U"}
              </span>
            </div>
          )}

          <div className="ml-3">
            <p className="text-base font-medium text-gray-800">
              {session.user?.name || "Unknown User"}
            </p>
            <p className="text-gray-500 text-xs">
              ID: {session.id ? session.id.substring(0, 8) + "..." : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md">
          <div>
            <p className="text-xs text-gray-500">Scheduled</p>
            <p className="text-sm font-medium text-gray-700">
              {formatDuration(session.duration)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Actual</p>
            <p className="text-sm font-medium text-gray-700">
              {actualDurationText}
            </p>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-1.5 ${
                session.attendance && session.attendance.userJoined
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <p className="text-xs text-gray-600">Client Joined</p>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-1.5 ${
                session.attendance && session.attendance.counsellorJoined
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <p className="text-xs text-gray-600">You Joined</p>
          </div>
        </div>

        {session.notes && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-gray-700 bg-gray-50 p-2 rounded-md text-xs leading-relaxed line-clamp-2">
              {session.notes}
            </p>
          </div>
        )}

        {activeStatus === "upcoming" && (
          <div className="mt-3 flex gap-2">
            {activeMode === "video" ? (
              <button
                disabled={!session.actions?.canJoin}
                className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  session.actions?.canJoin
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Join Meet
              </button>
            ) : activeMode === "chat" ? (
              <button
                disabled={!session.actions?.canJoin}
                className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  session.actions?.canJoin
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Open Chat
              </button>
            ) : (
              <button
                disabled={!session.actions?.canJoin}
                className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  session.actions?.canJoin
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Arrival
              </button>
            )}
          </div>
        )}

        {session.review !== null && activeStatus === "completed" && (
          <div className="mt-3 flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill={
                    i < Math.floor(session.review || 0)
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {typeof session.review === "number"
                ? session.review.toFixed(1)
                : "N/A"}{" "}
              / 5
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard; 