/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/page";
import Loader from "../../components/loader";
import { FaCalendar, FaVideo } from "react-icons/fa";
import { FaMessage, FaPerson } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
interface User {
  id: string;
  name: string;
  image: string;
}

interface Session {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  user: User;
  actions: {
    canJoin: boolean;
    canCancel: boolean;
  };
  createdAt: string;
  updatedAt: string;
  notes: string;
  meetLink: string;
  calendarLink: string;
  attendance: {
    userJoined: boolean;
    counsellorJoined: boolean;
  };
  review: number | null;
  startedAt?: string;
  endedAt?: string;
  actualDuration?: number;
}

interface ApiResponse {
  success: boolean;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  mode: string;
  status: string;
  sessions: Session[];
}

const fetchSessions = async (counsellorId: string, mode: string = "video", status: string = "upcoming"): Promise<Session[]> => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    const api = `${BASE_URL}/counsellor/get_counsellor_sessions.php?counsellorId=${counsellorId}&mode=${mode}&status=${status}&page=1&limit=10`;
    
    const response = await axios.get<ApiResponse>(api);

    if (response.data.success && response.data.sessions) {
      return response.data.sessions;
    }
    return [];
  } catch (error) {
    console.error("Error Fetching Data:", error);
    return [];
  }
};

const formatDuration = (minutes: number): string => {
  if (minutes < 0) return "Invalid duration";
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  }
};

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<string>("video");
  const [activeStatus, setActiveStatus] = useState<string>("upcoming");
  const [isClient, setIsClient] = useState(false);
  const { me } = useAuth();
  const router =useRouter();



  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (me?.id) {
        setLoading(true);
        const data = await fetchSessions(me.id, activeMode, activeStatus);
        setSessions(data);
        setLoading(false);
      }
    };
    getData();
  }, [activeMode, activeStatus, me?.id]);

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
  };

  // Return a simplified version for server-side rendering
  if (!isClient) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-16 md:ml-[250px] p-6">
          <h1 className="text-2xl text-indigo-500 font-semibold">My Sessions</h1>
          <div className="mt-10">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  const SessionCard = ({ session }: { session: Session }) => {
    const sessionDate = new Date(session.scheduledAt);
    const handleclick=()=>{
      router.push(`/sessions/${session.id}?userId=${session.user.id}`)
    }
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

    // Format the status text safely
    const formatStatus = (status: string | null | undefined): string => {
      if (!status) return "Unknown";
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
      <div onClick={handleclick} className="bg-white border-2 border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="bg-indigo-50 p-3 flex justify-between items-center border-b border-indigo-100">
          <div className="flex items-center">
            <span className="text-indigo-500 mr-2"><FaCalendar/></span>
            <span className="text-gray-700 font-medium text-sm">{formattedDate} at {formattedTime}</span>
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
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&color=4F46E5&background=EEF2FF`;
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <span className="text-indigo-500 text-lg font-medium">
                  {session.user && session.user.name ? session.user.name.charAt(0) : "U"}
                </span>
              </div>
            )}
            
            <div className="ml-3">
              <p className="text-base font-medium text-gray-800">{session.user?.name || "Unknown User"}</p>
              <p className="text-gray-500 text-xs">
                ID: {session.id ? session.id.substring(0, 8) + "..." : "N/A"}
              </p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md">
            <div>
              <p className="text-xs text-gray-500">Scheduled</p>
              <p className="text-sm font-medium text-gray-700">{formatDuration(session.duration)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Actual</p>
              <p className="text-sm font-medium text-gray-700">{actualDurationText}</p>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1.5 ${session.attendance && session.attendance.userJoined ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-xs text-gray-600">Client Joined</p>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1.5 ${session.attendance && session.attendance.counsellorJoined ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-xs text-gray-600">You Joined</p>
            </div>
          </div>

          {session.notes && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-gray-700 bg-gray-50 p-2 rounded-md text-xs leading-relaxed line-clamp-2">{session.notes}</p>
            </div>
          )}
          
          {activeStatus === "upcoming" && (
            <div className="mt-3 flex gap-2">
              {activeMode === "video" ? (
                <button 
                  disabled={!session.actions?.canJoin}
                  className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    session.actions?.canJoin 
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Join Meet
                </button>
              ) : activeMode === "chat" ? (
                <button 
                  disabled={!session.actions?.canJoin}
                  className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    session.actions?.canJoin 
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Open Chat
                </button>
              ) : (
                <button 
                  disabled={!session.actions?.canJoin}
                  className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    session.actions?.canJoin 
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={i < Math.floor(session.review || 0) ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-2">
                {typeof session.review === 'number' ? session.review.toFixed(1) : 'N/A'} / 5
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-16 md:ml-[250px] p-6">
        <h1 className="text-2xl text-indigo-500 font-semibold">My Sessions</h1>

        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-gray-700 font-medium">Mode:</h2>
              <div className="flex gap-2">
                <button 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeMode === "video" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleModeChange("video")}
                >
                  <span><FaVideo className="text-md"/></span> Video
                </button>
                <button 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeMode === "chat" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleModeChange("chat")}
                >
                  <span><FaMessage className="text-md"/></span> Chat
                </button>
                <button 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeMode === "in-person" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleModeChange("in-person")}
                >
                  <span><FaPerson className="text-md"/></span> In-Person
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-gray-700 font-medium">Status:</h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeStatus === "upcoming" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleStatusChange("upcoming")}
                >
                  Upcoming
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeStatus === "ongoing" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleStatusChange("ongoing")}
                >
                 Ongoing
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeStatus === "completed" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleStatusChange("completed")}
                >
                  Completed
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeStatus === "cancelled" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleStatusChange("cancelled")}
                >
                  Cancelled
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md transition duration-200 text-sm ${
                    activeStatus === "expired" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleStatusChange("expired")}
                >
                  Expired
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <Loader/>
          ) : sessions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 font-medium">No {activeStatus} sessions found</p>
                <p className="text-gray-500 text-sm mt-1">Try changing your filters or check back later</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;