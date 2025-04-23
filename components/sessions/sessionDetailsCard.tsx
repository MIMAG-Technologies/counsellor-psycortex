import { SessionDetails } from "@/types/sessiondetails/details";
import { UserDetails } from "@/types/sessiondetails/details";
import { SessionInfoGrid } from "./sessionInfoGrid";
import { InfoSection } from "./infoSection";
import { SessionActions } from "./sessionAction";
import { useRouter, useSearchParams } from "next/navigation";
import { FaComment, FaVideo } from "react-icons/fa";
import { useEffect, useState } from "react";

interface SessionDetailsCardProps {
  sessionDetails: SessionDetails;
  userDetails: UserDetails;
  handlers: {
    handleSubmitCase: () => void;
    handleViewCase: () => void;
    handleMarkComplete: () => void;
    handleRecommendTest: () => void;
  };
}

export function SessionDetailsCard({ sessionDetails, userDetails, handlers }: SessionDetailsCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isChat = sessionDetails.session_type === 'chat';
  const isUpcoming = sessionDetails.status === 'upcoming';
  const isActive = sessionDetails.status === 'active';

  useEffect(() => {
    // Get userId with priority from URL params, then userDetails
    const urlUserId = searchParams.get("userId");
    const detailsUserId = userDetails?.id;
    
    console.log("URL userId:", urlUserId);
    console.log("Details userId:", detailsUserId);
    
    const effectiveUserId = urlUserId || detailsUserId;
    
    if (effectiveUserId) {
      console.log("Setting effective userId:", effectiveUserId);
      setUserId(effectiveUserId);
    } else {
      console.error("No userId found in URL or userDetails");
    }
    
    setIsLoading(false);
  }, [searchParams, userDetails]);

  const handleJoinSession = () => {
    if (!userId) {
      console.error("No userId available");
      return;
    }

    if (isChat) {
      // Preserve the session ID format and append /chat
      const chatUrl = `/sessions/${sessionDetails.id}/chat?userId=${userDetails.id}`;

      console.log("Navigating to:", chatUrl);
      router.push(chatUrl);
    } else if (sessionDetails.meetLink) {
      window.open(sessionDetails.meetLink, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-indigo-500 px-6 py-4">
        <h2 className="text-xl font-medium text-white">Session Details</h2>
      </div>

      <div className="p-6 space-y-6">
        <SessionInfoGrid sessionDetails={sessionDetails} />

        <button
          onClick={handleJoinSession}
          disabled={isUpcoming || !userId || !isActive}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg 
            ${isUpcoming || !userId || !isActive
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'} 
            transition-colors`}
        >
          {isChat ? (
            <>
              <FaComment className="w-5 h-5" />
              <span>
                {isUpcoming 
                  ? 'Chat Session (Upcoming)' 
                  : !isActive 
                    ? 'Chat Session (Inactive)'
                    : 'Join Chat Session'}
              </span>
            </>
          ) : (
            <>
              <FaVideo className="w-5 h-5" />
              <span>
                {isUpcoming 
                  ? 'Video Session (Upcoming)' 
                  : !isActive 
                    ? 'Video Session (Inactive)'
                    : 'Join Video Session'}
              </span>
            </>
          )}
        </button>

        <InfoSection title="Session ID" content={sessionDetails.id} />

        {sessionDetails.notes && (
          <InfoSection title="Notes" content={sessionDetails.notes} />
        )}

        <SessionActions 
          sessionDetails={sessionDetails} 
          handlers={handlers} 
        />
      </div>
    </div>
  );
}