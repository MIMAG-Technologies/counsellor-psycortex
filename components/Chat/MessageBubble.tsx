import { ChatMessage } from '../../types/chat/chat';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

interface MessageBubbleProps {
  message: ChatMessage;
  baseUrl: string;
}

export function MessageBubble({ message, baseUrl }: MessageBubbleProps) {
  const isCounsellor = message.is_counsellor;
  const isMedia = message.message_type === 'media';
  
  // Format the timestamp
  const timestamp = formatRelativeTime(new Date(message.created_at));
  
  return (
    <div className={`flex ${isCounsellor ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-3/4 ${isCounsellor ? 'bg-white' : 'bg-blue-500 text-white'} rounded-lg px-4 py-2 shadow`}>
        {isCounsellor && (
          <div className="font-medium text-gray-700 mb-1">{message.sender_name}</div>
        )}
        
        {isMedia && message.media_url ? (
          <div className="mb-2">
            <img 
              src={`${baseUrl}/${message.media_url}`} 
              alt="Shared media" 
              className="rounded-md max-w-full" 
            />
          </div>
        ) : null}
        
        <p className={`text-sm ${isCounsellor ? 'text-gray-800' : 'text-white'}`}>{message.message}</p>
        
        <div className={`text-xs mt-1 text-right ${isCounsellor ? 'text-gray-500' : 'text-blue-100'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  );
}