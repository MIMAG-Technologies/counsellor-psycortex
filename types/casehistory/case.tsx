export interface CaseHistory {
    id: number;
    user_id: string;
    user_details: {
      name: string;
      gender: string;
      age: number;
    };
    counsellor_id: string;
    counsellor_name: string;
    session_id: string;
    session_type: string;
    created_at: string;
  }
  
  export interface CaseHistoryResponse {
    success: boolean;
    total_records: number;
    histories: CaseHistory[];
  }