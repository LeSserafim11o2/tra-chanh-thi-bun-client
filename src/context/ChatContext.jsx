import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from "axios";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [currentUserChat, setCurrentUserChat] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadByUser, setUnreadByUser] = useState({});

    useEffect(() => {
        if (user?._id) {
            socket.emit("register", { userId: user._id });
            fetchUnreadCount();
            fetchUnreadByUser();
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/unread/count`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error("Lỗi lấy số tin nhắn chưa đọc:", err);
        }
    };

    const fetchUnreadByUser = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/unread/by-user`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUnreadByUser(res.data);
        } catch (err) {
            console.error("Lỗi lấy tin nhắn chưa đọc theo user:", err);
        }
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("✅ Socket connected");
            setIsConnected(true);
            if (user?._id) {
                socket.emit("register", { userId: user._id });
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setIsConnected(false);
        });

        socket.on("receive-message", (msg) => {
            setMessages((prev) => {
                const exists = prev.some(m => m._id === msg._id);
                if (exists) return prev;
                return [...prev, msg];
            });

            const msgFromId = typeof msg.from === 'object' ? msg.from._id : msg.from;
            const msgToId = typeof msg.to === 'object' ? msg.to._id : msg.to;

            if (msgToId === user?._id && msgFromId !== user._id) {
                setUnreadCount(prev => prev + 1);
                setUnreadByUser(prev => ({
                    ...prev,
                    [msgFromId]: (prev[msgFromId] || 0) + 1
                }));
            }
        });

        socket.on("message-error", (error) => {
            console.error("❌ Message error:", error);
            alert("Lỗi gửi tin nhắn: " + error.error);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receive-message");
            socket.off("message-error");
        };
    }, [user]);

    const sendMessage = (to, message, isFromAdmin = false) => {
        if (!user) {
            console.error("❌ No user logged in");
            return;
        }
        if (!isConnected) {
            console.error("❌ Socket not connected");
            return;
        }
        
        socket.emit("send-message", {
            from: user._id,
            to,
            message,
            isFromAdmin,
        });
    };

    // Hàm đánh dấu tin nhắn từ một user đã đọc
    const markMessagesAsRead = (fromUserId) => {
        const unreadFromUser = unreadByUser[fromUserId] || 0;
        setUnreadCount(prev => prev - unreadFromUser);
        setUnreadByUser(prev => ({
            ...prev,
            [fromUserId]: 0
        }));
    };

    return (
        <ChatContext.Provider value={{ 
            messages, 
            setMessages, 
            sendMessage, 
            currentUserChat, 
            setCurrentUserChat,
            isConnected,
            unreadCount,
            unreadByUser,
            fetchUnreadCount,
            fetchUnreadByUser,
            markMessagesAsRead
        }}>
            {children}
        </ChatContext.Provider>
    );
};