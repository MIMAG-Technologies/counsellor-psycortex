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
  verificationStatus: VerificationStatus;
  metrics: Metrics;
  addresses: Address[];
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
  availability: Availability;
  pricing: Pricing;
}

export interface Availability {
  timeZone: string;
  weeklySchedule: WeeklySchedule[];
  communicationModes: CommunicationMode[];
}

export interface WeeklySchedule {
  date: string;
  day: string;
  isWorkingDay: number;
  working_hours: {
    start: string | null;
    end: string | null;
  };
  unavailable_slots: UnavailableSlot[];
}

export interface UnavailableSlot {
  time: string;
  is_available: boolean;
  status: string;
  leave_reason?: string | null;
  leave_until?: string | null;
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

export interface VerificationStatus {
  isVerified: boolean;
  documentsVerified: boolean;
  backgroundCheckDate: string;
}

export interface Metrics {
  totalSessions: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  cancellationRate: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
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