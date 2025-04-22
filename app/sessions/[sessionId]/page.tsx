"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Sidebar from "@/components/sidebar/page";
import Loader from "@/components/loader";
import { UserDetails, SessionDetails } from "@/types/sessiondetails/details";
import { UserProfileCard } from "@/components/sessions/UserProfileCard";
import { SessionDetailsCard } from "@/components/sessions/sessionDetailsCard";

// New imports for case history modal
import { CaseHistoryModal } from "@/components/Modals/casehistory";
import { CaseHistory } from "@/types/casehistory/case";

export default function SessionDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);

  // New state for case history modal
  const [showCaseHistory, setShowCaseHistory] = useState(false);
  const [caseHistories, setCaseHistories] = useState<CaseHistory[]>([]);
  const [caseHistoryLoading, setCaseHistoryLoading] = useState(false);

  // Handlers
  const handleSubmitCase = () => {
    console.log("Submit case clicked");
  };

  // UPDATED: View Case Handler to show modal
  const handleViewCase = async () => {
    if (!userId) return;

    setCaseHistoryLoading(true);
    setShowCaseHistory(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${BASE_URL}/user/get_case_history.php?user_id=${userId}`
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

  const handleMarkComplete = () => {
    console.log("Mark complete clicked");
  };

  const handleRecommendTest = () => {
    console.log("Recommend test clicked");
  };

  const actionHandlers = {
    handleSubmitCase,
    handleViewCase,
    handleMarkComplete,
    handleRecommendTest,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !params.sessionId) return;

      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        const userResponse = await fetch(
          `${BASE_URL}/user/get_user_details.php?userId=${userId}`
        );
        const userData = await userResponse.json();

        if (userData.success) {
          setUserDetails(userData.user);
        }

        const sessionResponse = await fetch(
          `${BASE_URL}/user/get_counselling_sessions.php?userId=${userId}`
        );
        const sessionData = await sessionResponse.json();

        if (sessionData.success) {
          const session = sessionData.sessions.find(
            (s: SessionDetails) => s.id === params.sessionId
          );
          if (session) {
            setSessionDetails(session);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, params.sessionId]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-[250px] p-6 max-w-7xl mx-auto">
        {/* User Profile Card */}
        {userDetails && <UserProfileCard userDetails={userDetails} />}

        {/* Session Details Card */}
        {sessionDetails && (
          <SessionDetailsCard
            sessionDetails={sessionDetails}
            handlers={actionHandlers}
          />
        )}

        {/* Case History Modal */}
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
      </div>
    </div>
  );
}
