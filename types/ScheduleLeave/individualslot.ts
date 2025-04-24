export interface IndividualSlotLeave {
    counsellorId: string;
    date: string;
    timeSlot: string;
    status: 'leave';
    leaveReason: string;
    leaveUntil: null;
  }
  
  export interface IndividualSlotResponse {
    success: boolean;
    message: string;
  }