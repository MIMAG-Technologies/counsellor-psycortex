"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loader from "@/components/loader";
import { UserDetails, SessionDetails } from "@/types/sessiondetails/details";
import { UserProfileCard } from "@/components/sessions/UserProfileCard";
import { SessionDetailsCard } from "@/components/sessions/sessionDetailsCard";
import { CaseHistoryModal } from "@/components/Modals/casehistory";
import { CaseHistory } from "@/types/casehistory/case";
import { MarkManagement } from "@/utils/ChatSession/MarkManagement";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { CaseHistoryForm } from "@/components/casehistory/CaseHistoryForm";
import { TestRecommendModal } from "@/components/Modals/testrecommend";

export default function SessionDetailsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [showCaseHistory, setShowCaseHistory] = useState(false);
  const [caseHistories, setCaseHistories] = useState<CaseHistory[]>([]);
  const [caseHistoryLoading, setCaseHistoryLoading] = useState(false);
  const [showCaseHistoryForm, setShowCaseHistoryForm] = useState(false);
  const [showRecommendTest, setShowRecommendTest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user , me } = useAuth();

  const handleSubmitCase = () => {
    if (!user?.uid || !sessionDetails?.id || !userDetails?.id) {
      toast.error("Missing required information");
      return;
    }
    setShowCaseHistoryForm(true);
  };

  const handleViewCase = async () => {
    if (!userDetails?.id) return;

    setCaseHistoryLoading(true);
    setShowCaseHistory(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${BASE_URL}/user/get_case_history.php?user_id=${userDetails.id}`
      );
      const data = await response.json();

      if (data.success) {
        setCaseHistories(data.histories);
      } else {
        setCaseHistories([]);
      }
    } catch (error) {
      console.error("Error fetching case history:", error);
      setCaseHistories([]);
    } finally {
      setCaseHistoryLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!user?.uid || !sessionDetails?.id) {
      console.error("Missing user ID or session ID");
      return;
    }
    const res = await MarkManagement({ counsellorId: user.uid, chatId: sessionDetails.id });
    if (res) {
      toast.success("Session marked as complete successfully!");
    } else {
      toast.error("Failed to mark session as complete.");
    }
  };

  const handleRecommendTest = () => {
    if (!user?.uid || !userDetails?.id) {
      toast.error("Missing required information");
      return;
    }
    setShowRecommendTest(true);
  };

  const actionHandlers = {
    handleSubmitCase,
    handleViewCase,
    handleMarkComplete,
    handleRecommendTest,
  };

  useEffect(() => {
    const fetchData = async () => {
      const searchUserId = searchParams.get("userId");
      if (!searchUserId || !sessionId) {
        setError("Missing user ID or session ID");
        setLoading(false);
        return;
      }

      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        // Step 1: Fetch user details
        const userResponse = await fetch(`${BASE_URL}/user/get_user_details.php?userId=${searchUserId}`);
        const userData = await userResponse.json();

        if (!userData.success || !userData.user?.id) {
          setError("Failed to fetch user details");
          setLoading(false);
          return;
        }

        const userId = userData.user.id;
        setUserDetails(userData.user);

        // Step 2: Try to fetch chat session
        const chatResponse = await fetch(`${BASE_URL}/user/get_chat_sessions.php?userId=${userId}`);
        const chatData = await chatResponse.json();

        if (chatData.success && chatData.sessions) {
          const chatSession = chatData.sessions.find(
            (s: SessionDetails) => s.id === sessionId
          );

          if (chatSession) {
            setSessionDetails({
              ...chatSession,
              session_type: "chat"
            });
            return;
          }
        }

        // Step 3: Try to fetch counselling session
        const counsellingResponse = await fetch(`${BASE_URL}/user/get_counselling_sessions.php?userId=${userId}`);
        const counsellingData = await counsellingResponse.json();

        if (counsellingData.success) {
          const videoSession = counsellingData.sessions.find(
            (s: SessionDetails) => s.id === sessionId
          );

          if (videoSession) {
            setSessionDetails({
              ...videoSession,
              session_type: "video"
            });
          } else {
            setError("Session not found");
          }
        } else {
          setError("Failed to fetch session details");
        }

      } catch (error) {
        console.error("Error fetching session data:", error);
        setError("An error occurred while fetching session details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, sessionId]);

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
      <div className="p-6 max-w-7xl mx-auto">
        {userDetails && <UserProfileCard userDetails={userDetails} />}
        {sessionDetails && userDetails && (
          <SessionDetailsCard
            sessionDetails={sessionDetails}
            userDetails={userDetails}
            handlers={actionHandlers}
          />
        )}
        {showCaseHistory && (
          <CaseHistoryModal
            histories={caseHistories}
            onClose={() => {
              setShowCaseHistory(false);
              setCaseHistories([]);
            }}
            loading={caseHistoryLoading}
          />
        )}
        {showCaseHistoryForm && sessionDetails && user?.uid && userDetails && (
          <CaseHistoryForm
            userId={userDetails.id}
            sessionId={sessionDetails.id}
            sessionType={sessionDetails.session_type}
            counsellorId={me?.id || ""}
            onClose={() => setShowCaseHistoryForm(false)}
          />
        )}
        {showRecommendTest && user?.uid && userDetails && (
          <TestRecommendModal
            userId={userDetails.id}
            counsellorId={me?.id || ""}
            onClose={() => setShowRecommendTest(false)}
          />
        )}
      </div>
    </div>
  );
} 