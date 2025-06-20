import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { FaRegTrashCan } from "react-icons/fa6";
import moment from "moment";
import "moment/dist/locale/vi";
moment.locale("vi");

const AdminChatPage = () => {
    const { user } = useAuth();
    const { messages, setMessages, currentUserChat, setCurrentUserChat, sendMessage, unreadByUser, markMessagesAsRead, fetchUnreadByUser } = useChat();
    const { clearChatNotification, socket } = useNotification();
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chatUsers/users`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setUsers(res.data);
            } catch (err) {
                console.error("Lỗi lấy danh sách người dùng:", err);
            }
        };
        if (user?.role === "admin") {
            fetchUsers();
            fetchUnreadByUser();
        }
    }, [user]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!currentUserChat) return;
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${currentUserChat}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setMessages(res.data);
                
                const unreadFromUser = unreadByUser[currentUserChat] || 0;
                if (unreadFromUser > 0) {
                    markMessagesAsRead(currentUserChat);
                }

                if (socket) {
                    const handleNewMessage = () => {
                        fetchUnreadByUser();
                        
                        if (currentUserChat) {
                            fetchMessages();
                        }

                    };

                    socket.on("receive-message", handleNewMessage);
                    socket.on("new-message-from-user", handleNewMessage);

                    return () => {
                        socket.off("receive-message", handleNewMessage);
                        socket.off("new-message-from-user", handleNewMessage);
                    };
                }
                    } catch (err) {
                        console.error("Lỗi lấy tin nhắn:", err);
                    }
                };
                fetchMessages();
    }, [socket, currentUserChat]);

    useEffect(() => {
        if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth"
        });
  }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !currentUserChat) return;
        sendMessage(currentUserChat, input, true);
        setInput("");
    };

    const handleSelectUser = (userId) => {
        setCurrentUserChat(userId);
        clearChatNotification();
        const unreadFromUser = unreadByUser[userId] || 0;
        if (unreadFromUser > 0) {
            markMessagesAsRead(userId);
        }
    };

    const handleDeleteConversation = async () => {
        if (!window.confirm("Bạn có chắc muốn xoá toàn bộ cuộc trò chuyện với user này không?")) return;

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${currentUserChat}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMessages([]);
            setCurrentUserChat(null);
        } catch (err) {
            console.error("Lỗi khi xoá tin nhắn:", err);
            alert("Xoá thất bại :<");
        }
    };

    if (!user || user.role !== "admin") return <div>Không có quyền truy cập</div>;

    return (
        <div className="flex h-[90vh] bg-gray-50">
            {/* Danh sách người dùng */}
            <div className="w-1/5 lg:w-1/4 bg-white dark:bg-black/80 border-r shadow-sm">
                <div className="p-4 border-b bg-pink-500 dark:bg-pink-200 dark:text-black text-white">
                    <h2 className="text-sm lg:text-lg font-bold">Người dùng chat</h2>
                    <p className="hidden lg:block text-sm opacity-90">
                        {users.length} người dùng
                    </p>
                </div>
                
                <div className="overflow-y-auto h-full">
                    {users.map((u) => {
                        const unreadFromUser = unreadByUser[u._id] || 0;
                        return (
                            <button
                                key={u._id}
                                onClick={() => handleSelectUser(u._id)}
                                className={`block w-full text-left px-4 py-3 border-b hover:bg-gray-50 dark:hover:bg-black/50 transition-colors relative ${
                                    currentUserChat === u._id ? "bg-pink-50 border-l-1 lg:border-l-4 border-l-pink-500 dark:bg-black/40": ""}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-row gap-3 items-center">
                                        <img src={u.avatar} alt={u.username} className="h-8 w-8 lg:h-12 lg:w-12 object-cover rounded-full"/>
                                        <div className="hidden lg:block">
                                            <div className="font-semibold text-gray-800 dark:text-pink-400">
                                                {u.username}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-pink-300">
                                                {u.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <FaRegTrashCan size={40} className="text-red-300 hover:text-red-500 p-2 hidden lg:block" onClick={handleDeleteConversation} />
                                    
                                    {/* Chấm đỏ thông báo */}
                                    {unreadFromUser > 0 && (
                                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {unreadFromUser > 9 ? '9+' : unreadFromUser}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                    
                    {users.length === 0 && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-50">
                            Chưa có người dùng nào chat
                        </div>
                    )}
                </div>
            </div>

            {/* Khu vực chat */}
            <div className="flex-1 flex flex-col bg-white dark:bg-black/60">
                {currentUserChat ? (
                    <>
                        {/* Header chat */}
                        <div className="p-4 border-b bg-gray-50 dark:bg-pink-100">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row gap-2 items-center">
                                    <img src={users.find(u => u._id === currentUserChat)?.avatar} alt="Ảnh đại diện" 
                                    className="h-8 w-8 lg:h-16 lg:w-16 object-cover rounded-full" />
                                    <div>
                                        <div className="font-semibold text-gray-800">
                                            Chat với {users.find(u => u._id === currentUserChat)?.username || 'Người dùng'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {users.find(u => u._id === currentUserChat)?.phone}
                                        </div>
                                    </div>
                                </div>
                                <FaRegTrashCan size={40} className="text-red-300 hover:text-red-500 p-2 block lg:hidden" onClick={handleDeleteConversation} />
                            </div>
                        </div>

                        {/* Tin nhắn */}
                        <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${msg.isFromAdmin ? "bg-pink-500 text-amber-50" : "bg-purple-400 text-amber-50"}`}>
                                        <div className="break-words">{msg.message}</div>
                                        <div className={`text-xs mt-1 ${msg.isFromAdmin ? 'text-amber-100' : 'text-gray-200'}`}>
                                            {moment(msg.createdAt).fromNow()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input gửi tin nhắn */}
                        <div className="border-t px-4 py-3 bg-gray-50 dark:bg-black/60">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-pink-500"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Nhập tin nhắn..."
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
                                    disabled={!input.trim()}
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-white">
                        <div className="text-center">
                            <div className="text-2xl mb-2">💬</div>
                            <div>Chọn một người dùng để bắt đầu chat</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPage;