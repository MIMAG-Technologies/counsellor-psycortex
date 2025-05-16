export type Education = {
  degree: string;
  field: string;
  institution: string;
  year: number;
};
export type License = {
  type: string;
  licenseNumber: string;
  issuingAuthority: string;
  validUntil: string;
};

export type SessionType =
  | "1 Hr Session"
  | "1 Hr Chat"
  | "1 Hr Video Session"
  | "1 Hr In-Person Session";
type AvailabilityType = "chat" | "call" | "video" | "in_person";

export type PricingItem = {
  sessionType: SessionType;
  sessionTitle: string;
  price: number;
  currency: string;
  typeOfAvailability: AvailabilityType;
};
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Language = {
  language: string;
  proficiencyLevel:
    | "Basic"
    | "Conversational"
    | "Professional"
    | "Fluent"
    | "Native";
};
export type ScheduleItem = {
  day: DayOfWeek;
  startTime: string | null;
  endTime: string | null;
  isWorkingDay: boolean;
};
export type counsellor = {
  basicInfo: {
    name: string;
    dateOfBirth: string;
    gender: string;
    biography: string;
    email: string;
    phone: string;
    profileImage: string;
  };
  professionalInfo: {
    title: string;
    yearsOfExperience: number;
    education: Education[];
    licenses: License[];
  };
  primaryAddress: {
    street_address: string;
    city: string;
    state: string;
    pincode: string;
  };
  preferredCenterAddress: {
    street_address: string;
    city: string;
    state: string;
    pincode: string;
  };
  communicationModes: {
    chat: boolean;
    call: boolean;
    video: boolean;
    in_person: boolean;
  };
  pricing: PricingItem[];
  schedule: ScheduleItem[];
  languages: Language[];
  specialties: string[];
};

export type Filters = {
  languages: {
    id: number;
    name: string;
    priority: number;
  }[];
  specialties: {
    id: number;
    name: string;
    priority: number;
  }[];
  genders: {
    id: number;
    name: string;
    priority: number;
  }[];
  priceRange: {
    id: number;
    min: number;
    max: number;
  };
  ratings: {
    min: number;
    max: number;
  };
};

export type Branches = {
  id: number;
  city: string;
  branch_name: string;
  full_address: string;
  street_address: string;
  state: string;
  pincode: string;
  is_active: boolean;
}[];
