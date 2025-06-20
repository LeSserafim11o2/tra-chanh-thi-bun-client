import { useState, useEffect, createContext } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [hasOrderNotification, setHasOrderNotification] = useState(false);
    const [hasChatNotification, setHasChatNotification] = useState(false);
    
    useEffect(() => {
        if (!user?._id) return;
        
        const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
        
        newSocket.on("connect", () => {
            newSocket.emit("register", { 
                userId: user._id, 
                role: user.role 
            });
        });
        
        if (user.role === "admin") {
            newSocket.on("new-order", () => setHasOrderNotification(true));
            newSocket.on("new-message-from-user", () => setHasChatNotification(true));
        } else {
            newSocket.on("order-status-update", () => setHasOrderNotification(true));
            newSocket.on("new-message-from-admin", () => setHasChatNotification(true));
        }
        
        setSocket(newSocket);
        
        return () => newSocket.disconnect();
    }, [user?._id, user?.role]);
    
    return (
        <SocketContext.Provider value={{
            socket,
            hasOrderNotification,
            hasChatNotification,
            clearOrderNotification: () => setHasOrderNotification(false),
            clearChatNotification: () => setHasChatNotification(false)
        }}>
            {children}
        </SocketContext.Provider>
    );
};