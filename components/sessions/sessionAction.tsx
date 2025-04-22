import { FaVideo, FaFile, FaEye, FaCheck, FaClipboardList } from "react-icons/fa6";
import { ActionButton } from "../button/actionButton";
import { SessionDetails } from "@/types/sessiondetails/details";

interface SessionActionsProps {
  sessionDetails: SessionDetails;
  handlers: {
    handleSubmitCase: () => void;
    handleViewCase: () => void;
    handleMarkComplete: () => void;
    handleRecommendTest: () => void;
  };
}

export function SessionActions({ sessionDetails, handlers }: SessionActionsProps) {
  const { handleSubmitCase, handleViewCase, handleMarkComplete, handleRecommendTest } = handlers;
  
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
        Actions
      </h3>
      
      {/* Primary Action - Join Chat */}
      {sessionDetails.meetLink && (
        <div className="mb-4">
          <ActionButton
            icon={<FaVideo className="w-5 h-5" />}
            label="Join Chat"
            onClick={() => window.open(sessionDetails.meetLink, '_blank')}
            variant="primary"
            fullWidth
          />
        </div>
      )}

      {/* Action Grid - 2 columns for better layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ActionButton
          icon={<FaFile className="w-4 h-4" />}
          label="Submit Case"
          onClick={handleSubmitCase}
          variant="info"
        />

        <ActionButton
          icon={<FaEye className="w-4 h-4" />}
          label="View Case History"
          onClick={handleViewCase}
          variant="secondary"
        />

        {sessionDetails.status === 'completed' ? (
          <div className="bg-green-500 text-white rounded-lg px-4 py-2.5 flex items-center justify-center gap-2">
            <FaCheck className="w-4 h-4" />
            <span>Session Completed</span>
          </div>
        ) : (
          <ActionButton
            icon={<FaCheck className="w-4 h-4" />}
            label="Mark as Complete"
            onClick={handleMarkComplete}
            variant="success"
          />
        )}

        <ActionButton
          icon={<FaClipboardList className="w-4 h-4" />}
          label="Recommend Test"
          onClick={handleRecommendTest}
          variant="outline"
        />
      </div>
    </div>
  );
}
