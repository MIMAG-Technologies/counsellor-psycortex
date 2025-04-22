export interface UserDetails {
    id: string;
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      gender: string;
      profileImage?: string;
    };
    stats: {
      counselling: {
        total: number;
        completed: number;
        upcoming: number;
      };
    };
  }
  
  export interface SessionDetails {
    id: string;
    scheduledAt: string;
    duration: number;
    status: string;
    is_couple_session: boolean;
    notes: string;
    meetLink: string;
    startedAt: string | null;
    endedAt: string | null;
    actualDuration: number | null;
    attendance: {
      userJoined: boolean;
      counsellorJoined: boolean;
    };
    review: {
      rating: string;
      feedback: string;
    } | null;
  }