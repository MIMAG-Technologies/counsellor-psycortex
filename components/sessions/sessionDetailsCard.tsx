import { SessionDetails } from "@/types/sessiondetails/details";
import { SessionInfoGrid } from "./sessionInfoGrid";
import { InfoSection } from "./infoSection";
import { SessionActions } from "./sessionAction";

interface SessionDetailsCardProps {
  sessionDetails: SessionDetails;
  handlers: {
    handleSubmitCase: () => void;
    handleViewCase: () => void;
    handleMarkComplete: () => void;
    handleRecommendTest: () => void;
  };
}

export function SessionDetailsCard({ sessionDetails, handlers }: SessionDetailsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-indigo-500 px-6 py-4">
        <h2 className="text-xl font-medium text-white">Session Details</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Session Info Grid */}
        <SessionInfoGrid sessionDetails={sessionDetails} />

        {/* Session ID */}
        <InfoSection title="Session ID" content={sessionDetails.id} />

        {/* Session Notes */}
        {sessionDetails.notes && (
          <InfoSection title="Notes" content={sessionDetails.notes} />
        )}

        {/* Actions Section */}
        <SessionActions 
          sessionDetails={sessionDetails} 
          handlers={handlers} 
        />
      </div>
    </div>
  );
}