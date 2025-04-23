import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../Chat/ChatService';
import { ChatMessage} from '../../types/chat/chat';
import { MessageBubble } from './MessageBubble';
import {  Send, Paperclip, X } from 'lucide-react';

interface ChatInterfaceProps {
  chatSessionId: string;
  patientName: string;
}

export default function ChatInterface({ chatSessionId, patientName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMediaMode, setIsMediaMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use env variable for API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const chatService = new ChatService(baseUrl);
  
  // Fetch messages on component mount
  useEffect(() => {
    if (chatSessionId) {
      fetchMessages();
      
      // Poll for new messages every 10 seconds
      const intervalId = setInterval(fetchMessages, 10000);
      
      return () => clearInterval(intervalId);
    }
  }, [chatSessionId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async () => {
    if (!chatSessionId) return;
    
    try {
      setIsLoading(true);
      const response = await chatService.getMessages(chatSessionId);
      
      if (response.success) {
        setMessages(response.messages);
        setIsActive(response.is_active);
        setSessionStatus(response.session_status);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (error) {
      setError('An error occurred while fetching messages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !isActive) return;
    
    try {
      setIsLoading(true);
      
      let response;
      if (selectedFile && isMediaMode) {
        response = await chatService.sendMessage(
          chatSessionId, 
          'Sending an Image', 
          'media', 
          selectedFile
        );
      } else {
        response = await chatService.sendMessage(
          chatSessionId, 
          newMessage.trim(), 
          'text'
        );
      }
      
      if (response.success) {
        setNewMessage('');
        setSelectedFile(null);
        setIsMediaMode(false);
        fetchMessages();
      } else {
        setError(response.message || 'Failed to send message');
      }
    } catch (error) {
      setError('An error occurred while sending your message');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsMediaMode(true);
    }
  };
  
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };
  
  const cancelFileUpload = () => {
    setSelectedFile(null);
    setIsMediaMode(false);
  };
  
  // Filter out messages from the current user (non-counsellor)
  const filteredMessages = messages.filter(msg => msg.is_counsellor);
  
  // Check if session is expired or inactive
  const canSendMessages = isActive && sessionStatus !== 'expired';
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-medium text-gray-700">Chat with {patientName}</h2>
            <p className="text-xs text-gray-500">Session ID: {chatSessionId}</p>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${
            sessionStatus === 'expired' 
              ? 'bg-red-100 text-red-700' 
              : isActive 
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}>
            {sessionStatus === 'expired' ? 'Expired' : isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
            <button 
              className="ml-2 text-red-500 hover:text-red-700" 
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {isLoading && messages.length === 0 && (
          <div className="flex justify-center p-4">
            <div className="animate-pulse">Loading messages...</div>
          </div>
        )}
        
        {filteredMessages.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          filteredMessages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              baseUrl={baseUrl} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-3">
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded flex justify-between items-center">
            <span className="text-sm truncate">
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </span>
            <button 
              onClick={cancelFileUpload}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          <button 
            onClick={openFileSelector}
            disabled={!canSendMessages}
            className={`p-2 rounded-full ${canSendMessages ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-300'}`}
          >
            <Paperclip size={20} />
          </button>
          
          <textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!canSendMessages}
            placeholder={canSendMessages ? "Type a message..." : "Chat session is unavailable"}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedFile) || !canSendMessages || isLoading}
            className={`p-2 rounded-full ${
              (!newMessage.trim() && !selectedFile) || !canSendMessages || isLoading
                ? 'bg-gray-200 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        {!canSendMessages && (
          <div className="text-xs text-red-500 mt-1 text-center">
            {sessionStatus === 'expired' 
              ? 'This chat session has expired. You cannot send new messages.' 
              : 'Chat is currently inactive. Please try again later.'}
          </div>
        )}
      </div>
    </div>
  );
}