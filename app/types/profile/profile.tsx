export interface PersonalInfo {
    name: string;
    dateOfBirth: string;
    gender: string;
    profileImage: string;
    biography: string;
    email: string;
    phone: string;
}

export interface CounsellorData {
    id: string;
    personalInfo: PersonalInfo;  
}

export interface ApiResponse {
    success: boolean;
    data: CounsellorData | null;
}
