import axios from 'axios';
import { CaseHistoryFormData } from '@/types/casehistory/casehistoryform';

export async function submitCaseHistory(formData: CaseHistoryFormData) {
  
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/submit_case_history.php`, formData);

    return true;
  } catch (error) {
    console.error('Error submitting case history:', error);
    return false;
  }
}