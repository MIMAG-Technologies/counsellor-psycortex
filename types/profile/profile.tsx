export interface CounselorProfileData {
  success: boolean;
  data: CounselorData;
}

export interface CounselorData {
  id: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  practiceInfo: PracticeInfo;
  sessionInfo: SessionInfo;
}

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
  institution: string;
  year: number;
}

export interface License {
  type: string;
  licenseNumber: string;
  issuingAuthority: string;
  validUntil: string;
}

export interface ProfessionalInfo {
  title: string;
  yearsOfExperience: number;
  education: Education[];
  licenses: License[];
}

export interface PracticeInfo {
  specialties: string[];
  languages: Language[];
}

export interface Language {
  language: string;
  proficiencyLevel: string;
}

export interface SessionInfo {
  availability: {
    timeZone: string;
    weeklySchedule: WeeklySchedule;
  };
  pricing: Pricing;
}

export interface Pricing {
  currency: string;
  rates: SessionRate[];
}

export type CommunicationMode = "chat" | "call" | "video";

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

export interface ApiResponse {
  success: boolean;
  data: CounselorData | null;
}


export type Me = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  documentsVerified: boolean;
}