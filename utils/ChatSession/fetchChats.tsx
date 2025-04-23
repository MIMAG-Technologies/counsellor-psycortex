import axios from 'axios';
import FormData from 'form-data';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface SendMessageParams {
  chat_session_id: string;
  sender_id: string;
  message: string;
  media?: File | null;
}

/**
 * Sends a message to the chat API with optional media attachment
 */
export const sendMessage = async ({ 
    chat_session_id, 
    sender_id, 
    message, 
    media = null 
  }: SendMessageParams): Promise<any> => {
    const formData = new FormData();
    
    formData.append('chat_session_id', chat_session_id);
    formData.append('sender_id', sender_id); 
    formData.append('message', message);
    
    if (media) {
      formData.append('media', media);
    }
  
    try {
      await axios.post(
        `${baseUrl}/psycortex-backend/chats/send_message.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw false;
    }
  };