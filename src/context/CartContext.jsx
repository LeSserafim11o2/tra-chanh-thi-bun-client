import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const clearCart = () => setCartItems({});

  const addToCart = (productId, quantity) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      const currentQty = Number(updated[productId]) || 0;
      const newQty = currentQty + quantity;

      if (newQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = newQty;
      }

      return updated;
    });
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, getTotalItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};