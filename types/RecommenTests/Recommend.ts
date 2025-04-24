export interface TestDetails {
    slug: string;
    name: string;
    description: string;
    shortDescription: string;
    imageUrl: string;
    benefits: string[];
    details: {
      durationMinutes: number;
      totalQuestions: number;
      minimumAge: number | null;
      maximumAge: number | null;
    };
  }
  
  export interface TestResponse {
    success: boolean;
    tests: TestDetails[];
  }
  
  export interface RecommendTestData {
    user_id: string;
    test_slug: string;
    counsellor_id: string;
  }