import axios from 'axios';
import { ApiResponse, Session, SessionMode, SessionStatus } from '@/types/sessions';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchSessionsParams {
  counsellorId: string;
  mode?: SessionMode | string;
  status?: SessionStatus | string;
  page?: number;
  limit?: number;
}

/**
 * Fetches sessions for a counsellor based on provided filters
 */
export const fetchSessions = async ({
  counsellorId,
  mode = 'video',
  status = 'upcoming',
  page = 1,
  limit = 10
}: FetchSessionsParams): Promise<Session[]> => {
  try {
    if (!counsellorId) {
      console.error('Counsellor ID is required');
      return [];
    }
    
    const api = `${BASE_URL}/counsellor/get_counsellor_sessions.php?counsellorId=${counsellorId}&mode=${mode}&status=${status}&page=${page}&limit=${limit}`;
    
    const response = await axios.get<ApiResponse>(api);

    if (response.data.success && response.data.sessions) {
      return response.data.sessions;
    }
    return [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

/**
 * Formats duration in minutes to a human-readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 0) return "Invalid duration";
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  }
};

/**
 * Format the status text with capitalization
 */
export const formatStatus = (status: string | null | undefined): string => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}; 