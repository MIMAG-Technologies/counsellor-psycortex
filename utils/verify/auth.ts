import axios from "axios";

interface VerifyResponse {
  success: boolean;
  authUrl: string;
  counsellor_id: string;
}

const base_url = process.env.NEXT_PUBLIC_API_URL;

export const getAuthUrl = async (counsellorId: string): Promise<string> => {
  try {
    const response = await axios.get<VerifyResponse>(
      `${base_url}/meet/auth.php?counsellor_id=${counsellorId}`
    );
    
    if (response.data.success && response.data.authUrl) {
      return response.data.authUrl;
    }
    throw new Error('Failed to get auth URL');
  } catch (error) {
    console.error("Error getting auth URL:", error);
    throw error;
  }
};