export interface CounselorStatsResponse {
  success: boolean;
  counsellorId: string;
  dateRange: {
    filter: string;
    startDate: string;
    endDate: string;
  };
  commissionRates: {
    video: string;
    chat: string;
    phone: string;
    offline: string;
    testRecommendation: string;
  };
  sessionCounts: {
    video: number;
    chat: number;
    phone: number;
    offline: number;
    total: number;
  };
  testReferrals: number;
  earnings: {
    video: string;
    chat: string;
    phone: string;
    offline: string;
    testRecommendation: string;
    total: string;
  };
} 