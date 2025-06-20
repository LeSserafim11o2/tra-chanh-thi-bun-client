import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem('token');

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setFavorites(res.data.map(p => p._id));
      } else {
        console.error("Favorites không phải mảng:", res.data);
      }
    } catch (err) {
      console.error("Lỗi lấy favorites:", err);
    }
  };

  const addFavorite = async (productId) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(prev => [...prev, productId]);
  };

  const removeFavorite = async (productId) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  useEffect(() => {
    if (token) fetchFavorites();
  }, [token]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
