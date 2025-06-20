import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ShowProduct from "./admin/ShowProduct";
import UpdateProduct from "./admin/UpdateProduct";
import CreateProduct from "./admin/CreateProduct";
import ProductCategory from "./components/ProductCategory";
import ProductDetail from "./components/ProductDetail";
import Profile from "./components/Profile";
import FavoritesPage from "./components/Favourites";
import Cart from "./pages/Cart";
import AdminOrdersPage from "./admin/OrdersPage";
import UserOrderHistory from "./pages/UserOrders";
import ChatPopup from "./components/ChatPopup";
import AdminChatPage from "./admin/AdminChatPage";
import NotFound from "./pages/NotFound";

const App = () => {

  return (
    <div className="select-none">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/products/category/:path" element={<ProductCategory/>}/>
          <Route path="/products/:slug" element={<ProductDetail/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/admin/products" element={<ShowProduct/>}/>
          <Route path="/admin/create" element={<CreateProduct/>}/>
          <Route path="/admin/update/:id" element={<UpdateProduct/>}/>
          <Route path="/admin/orders" element={<AdminOrdersPage/>}/>
          <Route path="/admin/chat" element={<AdminChatPage/>}/>
          <Route path="/user/profile" element={<Profile/>}/>
          <Route path="/user/favorites" element={<FavoritesPage/>}/>
          <Route path="/user/orders" element={<UserOrderHistory/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Footer/>
        <ChatPopup/>
        <Toaster position="top-center"/>
    </div>
  );
};
export default App
