import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaEye, FaEyeSlash, FaSearch, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/ThiBun.png";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import toast from "react-hot-toast";
import AvatarDefault from "../assets/AvatarDefault.jpg";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {return localStorage.getItem("theme") === "dark"});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login, user, logout } = useAuth();
  const { hasOrderNotification, hasChatNotification, clearOrderNotification } = useNotification();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^0\d{9}$/;
    const usernameRegex = /^[^\s]+$/;

    if (!isLogin) {
      if (!usernameRegex.test(username)) {
        toast.error("Tên người dùng không được chứa khoảng trắng!");
        return;
      }
    }

    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại phải có 10 số và bắt đầu bằng 0!");
      return;
    }

    if (password.length < 10) {
      toast.error("Mật khẩu phải từ 10 ký tự trở lên!");
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
          phone,
          password,
        });
        login(res.data.user, res.data.token);
        toast.success("Đăng nhập thành công!");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
          { username, phone, password }
        );
        toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        setIsLogin(true);
      }
      setIsModalOpen(false);
      setUsername("");
      setPhone("");
      setPassword("");
    } catch (err) {
      toast.error("Lỗi: " + (err.response?.data?.message || "Không rõ lỗi"));
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-pink-100 shadow sticky top-0 z-50 dark:bg-black/80">
      {/* Navbar Menu */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween" }}
              className="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-4 flex flex-col gap-4 text-pink-700 dark:text-white">
              <div className="flex justify-between items-center mb-4">
                <img src={logo} alt="Logo" className="h-10" />
                <button onClick={() => setIsMobileMenuOpen(false)}><IoCloseSharp size={24} /></button>
              </div>
              <Link to="/" className="text-2xl" onClick={() => {setIsMobileMenuOpen(false); scrollTo(0, 0)}}>Trang chủ</Link>
              <Link to="/about" className="text-2xl" onClick={() => {setIsMobileMenuOpen(false); scrollTo(0, 0)}}>Giới thiệu</Link>
              <Link to="/products" className="text-2xl" onClick={() => {setIsMobileMenuOpen(false); scrollTo(0, 0)}}>Sản phẩm</Link>
              {user?.role === "admin" && (<Link to="/admin/products" className="text-2xl" onClick={() => {setIsMobileMenuOpen(false); scrollTo(0, 0)}}>
              Quản lý
              {(hasOrderNotification || hasChatNotification) && (<span className="absolute -top-2 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>)}
              </Link>)}
              <form className="flex" onSubmit={handleSearch}>
                <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xl px-3 py-1 border focus:outline-none focus:ring-1 focus:ring-pink-300 block dark:border-white dark:placeholder:text-white/80"
                />
                <button type="submit" className="bg-pink-500 text-white px-4 py-1 hover:bg-pink-600 transition cursor-pointer dark:bg-pink-300 text-xl" 
                onClick={() => setIsMobileMenuOpen(false)}>
                  <FaSearch />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-6">
          <img src={logo} alt="Logo" className="h-10 hidden sm:block" />
          <button className="lg:hidden text-2xl text-pink-700 dark:text-white" onClick={() => setIsMobileMenuOpen(true)}><FaBars/></button>
          <nav className="hidden lg:flex gap-6 text-pink-700 font-semibold dark:text-pink-200">
            <Link to="/" onClick={() => scrollTo(0, 0)}>Trang chủ</Link>
            <Link to="/about" onClick={() => scrollTo(0, 0)}>Giới thiệu</Link>
            <Link to="/products" onClick={() => scrollTo(0, 0)}>Sản phẩm</Link>
            {user?.role === "admin" && (
              <Link to="/admin/products" onClick={() => scrollTo(0, 0)} className="relative">
                Quản lý
                {(hasOrderNotification || hasChatNotification) && (<span className="absolute -top-2 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>)}
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <form className="hidden lg:flex" onSubmit={handleSearch}>
            <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border focus:outline-none focus:ring-1 focus:ring-pink-300 dark:border-white dark:text-white/90 dark:placeholder:text-white/80"
            />
            <button type="submit" className="bg-pink-500 text-white px-4 py-1 hover:bg-pink-600 transition cursor-pointer dark:bg-pink-300">
              <FaSearch />
            </button>
          </form>
          <Link to="/cart" className="relative text-pink-500 dark:text-pink-300">
            <FaShoppingCart size={24} onClick={() => scrollTo(0, 0)} />
            <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs px-1 rounded-full">{getTotalItems()}</span>
          </Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-pink-500 text-white px-4 py-1 rounded-full cursor-pointer flex gap-1 items-center dark:bg-pink-300">
                {user.username}
                <img src={user.avatar || AvatarDefault} alt={user.name} className="h-6 w-6 rounded-full object-cover"/>
              </button>
              {isDropdownOpen && 
              <div className="absolute w-[80%] right-0 bg-pink-400 dark:bg-pink-300 shadow-md z-50 text-white rounded-md">
                <button onClick={() => {logout(); setIsDropdownOpen(false)}} className="block px-4 py-2 text-left text-sm dark:hover:bg-pink-400 hover:bg-pink-500 w-full">
                  Đăng xuất
                </button>
                <Link to={"/user/profile"} onClick={() => {scrollTo(0, 0); setIsDropdownOpen(false)}} className="block px-4 py-2 text-left text-sm dark:hover:bg-pink-400 hover:bg-pink-500 w-full">
                  Tài khoản
                </Link>
                <Link to={"/user/favorites"} onClick={() => {scrollTo(0, 0); setIsDropdownOpen(false)}} className="block px-4 py-2 text-left text-sm dark:hover:bg-pink-400 hover:bg-pink-500 w-full">
                  Yêu thích
                </Link>
                <div className="relative">
                  <Link to="/user/orders" onClick={() => {clearOrderNotification(); scrollTo(0, 0); setIsDropdownOpen(false)}}
                    className="block px-4 py-2 text-left text-sm dark:hover:bg-pink-400 hover:bg-pink-500 w-full"> Đơn hàng
                    {user?.role === "user" && hasOrderNotification && (<span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>)}
                  </Link>
                </div>
              </div>}
            </div>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="bg-pink-500 dark:bg-pink-300 dark:hover:bg-pink-400 text-white px-4 py-1 rounded-full hover:bg-pink-600 cursor-pointer">
              <FiUser size={20} className="inline mr-1"/> Đăng nhập
            </button>
          )}
          <button onClick={() => setDarkMode(!darkMode)} className="text-gray-500 dark:text-yellow-500 text-xl" title={darkMode ? "Tối" : "Sáng"}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
            <motion.div
              className="bg-white dark:bg-black/80 dark:text-white p-6 rounded-2xl w-96 shadow-lg relative"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp className="absolute right-3 top-3 text-pink-400 text-3xl cursor-pointer" onClick={() => setIsModalOpen(false)}/>
              <h2 className="text-xl font-bold text-pink-600 mb-4">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </h2>
              <form className="flex flex-col gap-4" onSubmit={handleAuthSubmit}>
                {!isLogin && (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">Tên người dùng</label>
                    <input
                      type="text"
                      placeholder="Tên người dùng"
                      required
                      className="border px-3 py-2 rounded focus:outline-none"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="font-bold">Số điện thoại</label>
                  <input type="tel" placeholder="Số điện thoại" required
                    className="border px-3 py-2 rounded focus:outline-none"
                    value={phone} min={10} onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} placeholder="Mật khẩu" required onChange={(e) => setPassword(e.target.value)}
                      className="border px-3 py-2 rounded w-full focus:outline-none" value={password} 
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <button className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600">
                  {isLogin ? "Đăng nhập" : "Đăng ký"}
                </button>
              </form>
              <p className="text-sm mt-4 text-center">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-pink-500 hover:underline">
                  {isLogin ? "Đăng ký" : "Đăng nhập"}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
