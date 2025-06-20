import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        location.reload();
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                } catch (err) {
                    console.error("Không lấy được user:", err);
                    logout();
                }
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);