import axios from "axios";




const BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

export const fetchDashboard =async()=>{
  try {
    const api = `${BASE_URL}/counsellor/get_counsellors_work.php?counsellorId=c123456&filter=custom&startDate=2025-01-01&endDate=2025-04-01`;
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};