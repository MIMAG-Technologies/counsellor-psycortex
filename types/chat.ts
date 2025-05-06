export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  is_counsellor: boolean;
  message_type: "text" | "media";
  message: string;
  media_url: string | null;
  media_type?: string;
  file_name?: string;
  is_read: boolean;
  created_at: string;
}