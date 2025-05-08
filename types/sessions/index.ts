export interface User {
  id: string;
  name: string;
  image: string;
}

export interface Session {
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
  mode?: string;
}

export interface ApiResponse {
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

export type SessionMode = 'video' | 'chat' | 'in-person';
export type SessionStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'expired'; 