"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Sidebar from "@/components/sidebar/page";
import Loader from "@/components/loader";
import { UserDetails, SessionDetails } from "@/types/sessiondetails/details";

// Import chat-related components
// import ChatInterface from "@/components/chat/chatInterface";

export default function ChatSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Extract sessionId from URL params
      const sessionIdFromParams = params.sessionId;
      // Extract userId from search params
      const userIdFromParams = searchParams.get("userId");
      
      console.log("Session ID from params:", sessionIdFromParams);
      console.log("User ID from search params:", userIdFromParams);
      
      if (!sessionIdFromParams) {
        setError("Missing session ID");
        setLoading(false);
        return;
      }
      
      if (!userIdFromParams) {
        setError("Missing user ID");
        setLoading(false);
        return;
      }
      
      setSessionId(sessionIdFromParams as string);
      setUserId(userIdFromParams);
      
      // Fetch user and session details
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        
        // Fetch user details
        const userResponse = await fetch(`${BASE_URL}/user/get_user_details.php?userId=${userIdFromParams}`);
        const userData = await userResponse.json();
        
        if (!userData.success || !userData.user) {
          setError("Failed to fetch user details");
          setLoading(false);
          return;
        }
        
        setUserDetails(userData.user);
        
        // Fetch session details
        const sessionResponse = await fetch(`${BASE_URL}/user/get_chat_session_details.php?sessionId=${sessionIdFromParams}&userId=${userIdFromParams}`);
        const sessionData = await sessionResponse.json();
        
        if (!sessionData.success || !sessionData.session) {
          setError("Failed to fetch session details");
          setLoading(false);
          return;
        }
        
        setSessionDetails(sessionData.session);
        
        // Additional initialization for chat
        // initializeChat(sessionIdFromParams, userIdFromParams);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-16 md:ml-[250px] p-6">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-16 md:ml-[250px] p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-[250px] p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Chat Session: {sessionId}
          </h2>
          
         
          
          {sessionDetails && (
            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Session Information</h3>
              <p className="text-gray-600">Status: {sessionDetails.status}</p>
              {sessionDetails.notes && (
                <p className="text-gray-600 mt-2">Notes: {sessionDetails.notes}</p>
              )}
            </div>
          )}
          
          {/* Chat interface would go here */}
          <div className="bg-gray-100 rounded p-4 min-h-64">
            {/* Replace with your chat interface component */}
            {/* <ChatInterface 
              sessionId={sessionId} 
              userId={userId} 
              userDetails={userDetails} 
            /> */}
            <p className="text-center text-gray-500">Chat interface would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}