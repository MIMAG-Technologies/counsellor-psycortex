import axios from 'axios';
import { CaseHistoryFormData } from '@/types/casehistory/casehistoryform';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const submitCaseHistory = async (formData: CaseHistoryFormData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/user/submit_case_history.php`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting case history:', error);
    throw error;
  }
};