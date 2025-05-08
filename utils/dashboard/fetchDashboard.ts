import axios from "axios";
import { CounselorStatsResponse } from "@/app/(authenticated)/dashboard/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchDashboardOptions {
  counsellorId: string;
  filter?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchDashboard = async ({
  counsellorId,
  filter = "custom",
  startDate = "2025-01-01",
  endDate = "2025-04-01"
}: FetchDashboardOptions): Promise<CounselorStatsResponse | null> => {
  try {
    const api = `${BASE_URL}/counsellor/get_counsellors_work.php?counsellorId=${counsellorId}&filter=${filter}&startDate=${startDate}&endDate=${endDate}`;
    const response = await axios.get<CounselorStatsResponse>(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}; 