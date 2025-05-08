import React from 'react';
import StatCard from './StatCard';
import { FaVideo, FaCommentDots, FaPhone, FaUser } from 'react-icons/fa';

interface SessionStatsProps {
  sessionCounts: {
    video: number;
    chat: number;
    phone: number;
    offline: number;
  };
}

const SessionStats: React.FC<SessionStatsProps> = ({ sessionCounts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Video Calls"
        value={sessionCounts.video}
        description="Live video consultations"
        icon={<FaVideo />}
        leftBorder
      />
      <StatCard
        title="Chat Interactions"
        value={sessionCounts.chat}
        description="Quick text conversations"
        icon={<FaCommentDots />}
        leftBorder
      />
      <StatCard
        title="Phone Calls"
        value={sessionCounts.phone}
        description="Voice-based consultations"
        icon={<FaPhone />}
        leftBorder
      />
      <StatCard
        title="In-Person Meetings"
        value={sessionCounts.offline}
        description="Face-to-face interactions"
        icon={<FaUser />}
        leftBorder
      />
    </div>
  );
};

export default SessionStats; 