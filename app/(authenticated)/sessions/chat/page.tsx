/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { FaPaperPlane, FaPaperclip, FaArrowLeft } from "react-icons/fa6";
import { JSX } from "react/jsx-runtime";
import { sendMessage } from "@/utils/ChatSession/fetchChats";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { RiCheckDoubleFill } from "react-icons/ri";

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
    session_status?: string;
    session_end_time?: string;
    is_active?: boolean;
}

const POLLING_INTERVAL = 2500;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ChatSessionPage(): JSX.Element {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSessionEnded, setIsSessionEnded] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
    const [clientName, setClientName] = useState<string>("");
    const [sendingMessage, setSendingMessage] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Extract client name from messages
    useEffect(() => {
        if (messages.length > 0) {
            const clientMsg = messages.find(msg => !msg.is_counsellor);
            if (clientMsg) {
                setClientName(clientMsg.sender_name);
            }
        }
    }, [messages]);

    // Calculate remaining time for session
    const calculateTimeRemaining = (endTime: string) => {
        if (!endTime) return;

        const now = new Date();
        const sessionEndTime = new Date(endTime);

        // Calculate remaining time
        const remainingMs = sessionEndTime.getTime() - now.getTime();

        if (remainingMs <= 0) {
            setTimeRemaining("00:00");
            setIsSessionEnded(true);
        } else {
            const minutes = Math.floor(remainingMs / (1000 * 60));
            const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

            setTimeRemaining(
                `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
            setIsSessionEnded(false);
        }
    };

    const fetchMessages = async () => {
        if (!sessionId) {
            setError("Missing session ID");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `${baseUrl}/chats/get_messages.php?chat_session_id=${sessionId}&limit=50`
            );
            const data: ApiResponse = await res.json();

            if (data.success && data.messages) {
                // Vibrate when new message received
                if (messages.length > 0 && data.messages.length > messages.length) {
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(100);
                    }
                }

                setMessages(data.messages);

                // Update session status
                if (data.session_end_time) {
                    calculateTimeRemaining(data.session_end_time);
                }

                if (data.is_active === false) {
                    setIsSessionEnded(true);
                }

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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if ((!newMessage.trim() && !selectedFile) || isSessionEnded) return;

        setSendingMessage(true);

        try {
            const messageData = {
                chat_session_id: sessionId || "",
                sender_id: me?.id || "",
                message: newMessage,
                media: selectedFile,
            };

            const response = await sendMessage(messageData);

            if (response) {
                setNewMessage("");
                setSelectedFile(null);
                await fetchMessages(); // Refresh messages after successful send
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setSendingMessage(false);
        }
    };

    // Add a reference to the polling interval
    let fetchMessagesInterval: NodeJS.Timeout | null = null;

    useEffect(() => {
        fetchMessages();

        if (!isSessionEnded) {
            fetchMessagesInterval = setInterval(fetchMessages, POLLING_INTERVAL);
        }

        return () => {
            if (fetchMessagesInterval) clearInterval(fetchMessagesInterval);
        };
    }, [sessionId , isSessionEnded]);

    useEffect(() => {
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages]);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="h-screen flex items-center justify-center">
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <div className="p-6">
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col fixed inset-0 bg-gray-100">
            {/* Chat header */}
            <div className="bg-[#642494] text-white p-4 shadow-md flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => window.history.back()}
                        className="mr-3 p-2 hover:bg-[#4e1c73] rounded-full transition-colors"
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white mr-3">
                            <div className="w-full h-full bg-[#f5edfb] text-[#642494] flex items-center justify-center font-bold">
                                {clientName ? clientName.charAt(0).toUpperCase() : 'C'}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">
                                {clientName || "Client"}
                            </h1>
                            <p className="text-xs opacity-90">Session ID: {sessionId}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="text-sm bg-white text-purple-700 px-3 py-1 rounded-full font-mono font-medium mr-2">
                        {timeRemaining}
                    </div>
                </div>
            </div>

            {/* Messages container */}
            <div
                ref={messageContainerRef}
                className="flex-1 p-4 overflow-y-auto bg-[#f5f5f5]"
            >
                {messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 mb-2">No messages yet.</p>
                            <p className="text-[#642494] font-medium">Start the conversation with your client!</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.is_counsellor ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div className={`flex max-w-[80%] ${msg.is_counsellor && "flex-row-reverse"}`}>
                                    {!msg.is_counsellor && (
                                        <div className="self-end mb-2 mr-2">
                                            <div className="w-8 h-8 rounded-full bg-[#f5edfb] text-[#642494] flex items-center justify-center font-bold">
                                                {msg.sender_name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`rounded-2xl px-4 py-3 ${msg.is_counsellor
                                                ? "bg-[#642494] text-white rounded-tl-none shadow-sm"
                                                : "bg-white text-gray-800 rounded-tr-none shadow-sm"
                                            }`}
                                    >
                                        {msg.message_type === "text" ? (
                                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        ) : (
                                            <div>
                                                <div className="rounded-lg overflow-hidden mb-2 border border-gray-200 bg-white">
                                                    <img
                                                        src={msg.media_url ? `${baseUrl}/${msg.media_url}` : ""}
                                                        alt="Media attachment"
                                                        className="w-full max-h-60 object-contain"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/image-placeholder.png";
                                                        }}
                                                    />
                                                </div>
                                                {msg.message && <p className="text-sm whitespace-pre-wrap">{msg.message}</p>}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-1 text-xs opacity-75">
                                            <span>
                                                {new Date(msg.created_at).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                            {msg.is_counsellor && (
                                                <span className="ml-2 flex items-center">
                                                    {msg.is_read ? (
                                                        <RiCheckDoubleFill className="text-blue-500" size={12} />
                                                    ) : (
                                                        <RiCheckDoubleFill className="text-gray-300" size={12} />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {msg.is_counsellor && (
                                        <div className="self-end mb-2 ml-2">
                                            <div className="w-8 h-8 rounded-full bg-[#f5edfb] text-[#642494] flex items-center justify-center font-bold">
                                                {me?.name?.charAt(0).toUpperCase() || 'C'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message input */}
            <div className="bg-white shadow-md p-4 border-t border-gray-200">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center max-w-3xl mx-auto"
                >
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={isSessionEnded}
                        className={`p-3 rounded-l-lg border border-gray-300 bg-gray-50 flex items-center justify-center ${isSessionEnded ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                            }`}
                    >
                        <FaPaperclip className="text-gray-500" />
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 p-3 border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#642494] focus:border-transparent"
                        disabled={sendingMessage || isSessionEnded}
                    />

                    <button
                        type="submit"
                        disabled={sendingMessage || (!newMessage.trim() && !selectedFile) || isSessionEnded}
                        className={`bg-[#642494] text-white p-3 rounded-r-lg flex items-center justify-center ${sendingMessage || (!newMessage.trim() && !selectedFile) || isSessionEnded
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#4e1c73] transition-colors"
                            }`}
                    >
                        <FaPaperPlane className="text-lg" />
                    </button>
                </form>

                {selectedFile && (
                    <div className="max-w-3xl mx-auto mt-2 bg-gray-100 p-2 rounded-md flex items-center justify-between">
                        <span className="text-sm truncate">{selectedFile.name}</span>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-red-500 hover:text-red-700 ml-2 text-sm"
                        >
                            Remove
                        </button>
                    </div>
                )}

                {/* Session ended message */}
                {isSessionEnded && (
                    <div className="max-w-3xl mx-auto mt-2 bg-gray-100 text-gray-700 p-2 rounded-md text-center text-sm">
                        This session has ended. You cannot send more messages.
                    </div>
                )}

                {/* Error display */}
                {error && (
                    <div className="max-w-3xl mx-auto mt-2 bg-red-50 text-red-600 p-2 rounded-md text-center text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}