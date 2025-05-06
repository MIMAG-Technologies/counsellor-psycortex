/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar/page";
import Loader from "@/components/loader";
import { FaPaperPlane, FaPaperclip, FaArrowLeft } from "react-icons/fa6";
import { JSX } from "react/jsx-runtime";
import { sendMessage } from "@/utils/ChatSession/fetchChats";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  is_counsellor: boolean;
  message_type: "text" | "media";
  message: string;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  messages: Message[];
}

const POLLING_INTERVAL = 2500;

export default function ChatSessionPage(): JSX.Element {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const { me } = useAuth();

  const scrollToBottom = () => {
    if (messagesEndRef.current && messageContainerRef.current) {
      const { scrollHeight, clientHeight } = messageContainerRef.current;
      messageContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  const fetchMessages = async () => {
    const sessionId = params.sessionId as string;
    if (!sessionId) {
      setError("Missing session ID");
      setLoading(false);
      return;
    }

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${BASE_URL}/chats/get_messages.php?chat_session_id=${sessionId}&limit=50`
      );
      const data: ApiResponse = await res.json();

      if (data.success && data.messages) {
        setMessages(data.messages);
        // Delay scroll to ensure DOM is updated
        setTimeout(scrollToBottom, 100);
      } else {
        setError("Failed to load messages");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    const sessionId = params.sessionId as string;
    try {
      const messageData = {
        chat_session_id: sessionId,
        sender_id: me?.id || "",
        message: newMessage,
        media: selectedFile,
      };

      const response = await sendMessage(messageData);

      if (response) {
        setNewMessage("");
        setSelectedFile(null);
        await fetchMessages(); // Refresh messages after successful send
        scrollToBottom();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Stop polling for new messages
      if (fetchMessagesInterval) {
        clearInterval(fetchMessagesInterval);
      }

      // Add the message to the list
      const tempMessage: Message = {
        id: Date.now().toString(),
        sender_id: me?.id || "",
        sender_name: me?.name || "You",
        is_counsellor: false,
        message_type: selectedFile ? "media" : "text",
        message: newMessage,
        media_url: selectedFile ? URL.createObjectURL(selectedFile) : null,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setNewMessage("");
      setSelectedFile(null);
    }
  };

  // Add a reference to the polling interval
  let fetchMessagesInterval: NodeJS.Timeout | null = null;

  useEffect(() => {
    fetchMessages();
    fetchMessagesInterval = setInterval(fetchMessages, POLLING_INTERVAL);
    return () => {
      if (fetchMessagesInterval) clearInterval(fetchMessagesInterval);
    };
  }, [params]);

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-16 md:ml-[250px] h-screen flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-16 md:ml-[250px] p-6">
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-[250px] h-screen flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-indigo-500 px-6 py-5 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="text-white hover:text-indigo-100 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Chat Session
                </h1>
                <p className="text-indigo-100 text-sm mt-1">
                  Session ID: {params.sessionId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area with Improved Scrolling */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto scroll-smooth p-4 space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.is_counsellor ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.is_counsellor
                    ? "bg-white border border-gray-200"
                    : "bg-indigo-500 text-white"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender_name}</p>
                {msg.message_type === "text" ? (
                  <p className="text-base whitespace-pre-wrap">{msg.message}</p>
                ) : (
                  <img
                    src={msg.media_url || ""}
                    alt="Media"
                    className="max-w-full rounded"
                    loading="lazy"
                  />
                )}
                <p
                  className={`text-xs mt-1 ${
                    msg.is_counsellor ? "text-gray-500" : "text-indigo-100"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-2 max-w-4xl mx-auto">
            {/* Image Preview */}
            {selectedFile && (
              <div className="relative w-full max-w-xs">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="w-full h-auto rounded-lg border"
                />
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  X
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                <FaPaperclip className="w-5 h-5 text-gray-500 hover:text-purple-500 transition-colors" />
              </label>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !selectedFile}
                className={`p-2 rounded-lg transition-colors ${
                  newMessage.trim() || selectedFile
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}