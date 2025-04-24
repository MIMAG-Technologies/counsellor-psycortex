export interface MultiDayLeave {
    counsellor_id: string;
    start_date: string;
    end_date: string;
    leave_reason: string;
  }
  
  export interface MultiDayLeaveResponse {
    success: boolean;
    message: string;
  }