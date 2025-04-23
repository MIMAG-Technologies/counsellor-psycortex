export interface ChatMessage {
    id: string;
    sender_id: string;
    sender_name: string;
    is_counsellor: boolean;
    message_type: 'text' | 'media';
    message: string;
    media_url: string | null;
    is_read: boolean;
    created_at: string;
  }
  
  export interface ChatResponse {
    success: boolean;
    messages: ChatMessage[];
    total: number;
    has_more: boolean;
    session_status: string;
    session_end_time: string;
    is_active: boolean;
  }
  
  export interface SendMessageResponse {
    success: boolean;
    message?: string;
  }