import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LoadingProvider } from "./context/LoadingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <CartProvider>
              <FavoritesProvider>
                <LoadingProvider><App/></LoadingProvider>
              </FavoritesProvider>
            </CartProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);