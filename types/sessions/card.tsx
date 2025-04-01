export interface CardProps {
    mode: string;
    status: string;
    sessions: Session[];
  }
  
  export interface Session {
    mode: string;
    id: string;
    scheduledAt: string;
    duration: number;
    status: string;
    user: User;
    actions: Actions;
    createdAt: string;
    updatedAt: string;
    notes: string;
    meetLink: string;
    calendarLink: string;
    attendance: Attendance;
    review: boolean | null;
    startedAt: string;
    endedAt: string;
    actualDuration: number;
  }
  
  export interface User {
    id: string;
    name: string;
    image: string; 
  }
  
  export interface Actions {
    canJoin: boolean;
    canCancel: boolean;
  }
  
  export interface Attendance {
    userJoined: boolean;
    counsellorJoined: boolean;
  }
  