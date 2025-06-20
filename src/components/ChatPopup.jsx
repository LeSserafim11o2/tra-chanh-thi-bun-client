import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaCommentDots } from "react-icons/fa";
import moment from "moment";
import "moment/dist/locale/vi";
moment.locale("vi");

const ChatPopup = () => {
    const { user } = useAuth();
    const { messages, setMessages, sendMessage, unreadByUser, markMessagesAsRead } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    const unreadFromAdmin = unreadByUser[import.meta.env.VITE_ADMIN_ID] || 0;

    useEffect(() => {
        if (!user) return;
        if (!isOpen) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${import.meta.env.VITE_ADMIN_ID}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setMessages(res.data);
                
                if (unreadFromAdmin > 0) {
                    markMessagesAsRead(import.meta.env.VITE_ADMIN_ID);
                }
            } catch (err) {
                console.error("Lỗi lấy tin nhắn:", err);
            }
        };

        fetchMessages();
    }, [user, isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        console.log("🚀 Sending message:", {
            to: import.meta.env.VITE_ADMIN_ID,
            message: input,
            from: user._id
        });
        sendMessage(import.meta.env.VITE_ADMIN_ID, input, false);
        setInput("");
    };

    const handleOpenChat = () => {
        setIsOpen(true);
        if (unreadFromAdmin > 0) {
            markMessagesAsRead(import.meta.env.VITE_ADMIN_ID);
        }
    };

    if (!user || user.role === "admin") return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <div className="relative">
                    <button
                        onClick={handleOpenChat}
                        className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
                    >
                        <FaCommentDots size={24} />
                    </button>
                    
                    {unreadFromAdmin > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                            {unreadFromAdmin > 9 ? '9+' : unreadFromAdmin}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-black/80 w-80 h-96 shadow-xl rounded-xl flex flex-col overflow-hidden border">
                    <div className="bg-pink-500 text-white px-4 py-2 flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            Chat với Admin
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </span>
                        <IoMdClose
                            className="cursor-pointer text-lg hover:text-gray-200"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                                    msg.isFromAdmin 
                                        ? "bg-purple-200 self-start mr-auto" 
                                        : "bg-pink-300 self-end ml-auto"
                                }`}
                            >
                                <div className="break-words dark:text-black">{msg.message}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-700 mt-1">
                                    {moment(msg.createdAt).fromNow()}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="border-t px-2 py-2 flex gap-2">
                        <input
                            className="flex-1 border px-3 py-1 rounded text-sm focus:outline-none focus:border-pink-500"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            className="bg-pink-500 text-white px-3 rounded hover:bg-pink-600 disabled:opacity-50"
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatPopup;