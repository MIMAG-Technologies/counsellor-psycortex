import {  ChatResponse, SendMessageResponse } from '../../types/chat/chat';

export class ChatService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getMessages(chatSessionId: string, limit: number = 20): Promise<ChatResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chats/get_messages.php?chat_session_id=${chatSessionId}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching messages: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  async sendMessage(
    chatSessionId: string, 
    message: string, 
    messageType: 'text' | 'media' = 'text',
    mediaFile?: File
  ): Promise<SendMessageResponse> {
    try {
      let formData;
      
      if (messageType === 'media' && mediaFile) {
        // Handle media uploads
        formData = new FormData();
        formData.append('chat_session_id', chatSessionId);
        formData.append('message', message);
        formData.append('message_type', messageType);
        formData.append('media_file', mediaFile);
      } else {
        // Regular text message
        const data = {
          chat_session_id: chatSessionId,
          message,
          message_type: messageType
        };
        
        return fetch(`${this.baseUrl}/chats/send_message.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Error sending message: ${response.statusText}`);
          }
          return response.json();
        });
      }
      
      // Send with FormData if it's a media upload
      if (formData) {
        return fetch(`${this.baseUrl}/chats/send_message.php`, {
          method: 'POST',
          body: formData,
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Error sending media: ${response.statusText}`);
          }
          return response.json();
        });
      }
      
      throw new Error('Failed to send message: Invalid parameters');
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
}