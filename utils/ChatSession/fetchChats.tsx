/* eslint-disable @typescript-eslint/no-explicit-any */
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
        `${baseUrl}/chats/send_message.php`,
        formData,
      );
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw false;
    }
  };