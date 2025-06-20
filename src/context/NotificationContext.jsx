import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [hasOrderNotification, setHasOrderNotification] = useState(false);
    const [hasChatNotification, setHasChatNotification] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user?._id) return;

        const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
            transports: ["websocket"],
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            newSocket.emit("register", { userId: user._id, role: user.role });
        });

        if (user.role === "admin") {
            newSocket.on("new-order", () => {
                setHasOrderNotification(true);
            });

            newSocket.on("new-message-from-user", () => {
                setHasChatNotification(true);
            });
        } else {
            newSocket.on("order-status-update", () => {
                setHasOrderNotification(true);
            });

            newSocket.on("new-message-from-admin", () => {
                setHasChatNotification(true);
            });
        }

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?._id, user?.role]);

    const clearOrderNotification = () => {
        setHasOrderNotification(false);
    };
    
    const clearChatNotification = () => {
        setHasChatNotification(false);
    };

    return (
        <NotificationContext.Provider
            value={{
                hasOrderNotification,
                hasChatNotification,
                clearOrderNotification,
                clearChatNotification,
                socket,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);