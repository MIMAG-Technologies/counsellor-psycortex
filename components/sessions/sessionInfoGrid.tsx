import { FaCalendar, FaClock, FaHourglassHalf, FaCircle } from "react-icons/fa6";
import { SessionInfoItem } from "./sessionInfo";
import { SessionDetails } from "@/types/sessiondetails/details";

interface SessionInfoGridProps {
  sessionDetails: SessionDetails;
}

export function SessionInfoGrid({ sessionDetails }: SessionInfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <SessionInfoItem 
        icon={<FaCalendar className="w-4 h-4 text-indigo-600" />}
        label="Date"
        value={new Date(sessionDetails.scheduledAt).toLocaleDateString()}
      />
      
      <SessionInfoItem 
        icon={<FaClock className="w-4 h-4 text-indigo-600" />}
        label="Time"
        value={new Date(sessionDetails.scheduledAt).toLocaleTimeString()}
      />
      
      <SessionInfoItem 
        icon={<FaHourglassHalf className="w-4 h-4 text-indigo-600" />}
        label="Duration"
        value={`${sessionDetails.duration} minutes`}
      />
      
      <SessionInfoItem 
        icon={<FaCircle className="w-4 h-4 text-indigo-600" />}
        label="Status"
        value={sessionDetails.status.toUpperCase()}
      />
    </div>
  );
}