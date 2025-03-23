export interface sessionInfo {
    availability: {
      timeZone: string;
      weeklySchedule: WeeklySchedule[]; 
    };
  }
  
  export interface WeeklySchedule {
    date: string;
    day: string;
    isWorkingDay: number;
    working_hours: {
      start: string | null;
      end: string | null;
    };
    unavailable_slots: {
      time: string;
      is_available: boolean;
      status: string;
      leave_reason: string | null;
      leave_until: string | null;
    }[];
  }
  