export interface PersonalInfo {
    name: string;
    dateOfBirth: string;
    gender: string;
    profileImage: string;
    biography: string;
    email: string;
    phone: string;
}

export interface Education {
    degree: string;
    field: string;
    year: string;
}

export interface Licenses {
    type: string;
    licenseNumber: string;
    issuingAuthority: string;
    validUntil: string;
}

export interface ProfessionalInfo { 
    title: string;
    yearsOfExperience: number;
    education: Education[];
    licenses: Licenses[];
}

export interface CounsellorData {
    id: string;
    personalInfo: PersonalInfo;
    professionalInfo: ProfessionalInfo; 
    practiceInfo:PracticeInfo;
    sessionInfo:SessionInfo
    pricing:Pricing
}

export interface ApiResponse {
    success: boolean;
    data: CounsellorData | null;
}

export interface Language{
    languages:string;
    proficiencyLevel:string;
    
} 
export interface PracticeInfo{
    specialties:string[];
    languages:Language[];
}

export interface SessionInfo{
  availability:{
    timeZone:string;
    weeklySchedule:WeeklySchedule;
    

  }
}


export interface Pricing{
  currency:string;
  rates:SessionRate[]
}
type CommunicationMode = "chat" | "call" | "video";

export interface SessionRate {
  sessionType: string;
  price: number;
  currency: string;
  sessionTitle: string;
  availabilityTypes: CommunicationMode[];
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
    leave_reason?: string | null;
    leave_until?: string | null;
  }[];
}

