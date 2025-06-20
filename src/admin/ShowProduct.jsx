import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";
import {toast} from "react-hot-toast";

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const { hasOrderNotification, hasChatNotification } = useNotification();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi fetch sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen])

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/${selectedProduct._id}`);
      setIsModalOpen(false);
      fetchProducts();
      toast.success("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
      toast.error("Có lỗi khi xóa sản phẩm!");
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIdx, startIdx + productsPerPage);

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-8 bg-pink-100 dark:bg-black/75 min-h-screen w-[90%] mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600 font-sans dark:text-pink-300">
          🛍️ Các sản phẩm Trà Chanh Thị Bún
        </h1>
        <div className="grid grid-cols-1 max-w-lg lg:grid-cols-3 gap-4 lg:max-w-3xl mx-auto mt-4">
          <Link
            to="/admin/create"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200 dark:bg-pink-300 dark:hover:bg-pink-400"
          >
            Thêm sản phẩm mới
          </Link>
          <Link
            to="/admin/orders"
            className="relative bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200 dark:bg-pink-300 dark:hover:bg-pink-400"
          >
            Danh sách đơn hàng
            {hasOrderNotification && (
              <span className="absolute -top-1 -right-3 w-3 h-3 bg-pink-500 rounded-full"></span>
            )}
          </Link>
          <Link
            to="/admin/chat"
            className="relative bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200 dark:bg-pink-300 dark:hover:bg-pink-400"
          >
            Trò chuyện
            {hasChatNotification && (
              <span className="absolute -top-1 -right-3 w-3 h-3 bg-pink-500 rounded-full"></span>
            )}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {currentProducts.map((product) => (
          <div key={product._id} className="bg-white dark:bg-black/70 rounded-2xl shadow-md overflow-hidden hover:shadow-pink-300 transition-all border-2 border-solid border-pink-300">
            <img src={product.image} alt={product.name} className="w-full h-72 object-cover"/>
            <div className="p-4">
              <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-400 h-15">{product.name}</h2>
              <p className="text-gray-600 text-md my-2 dark:text-white/80">💸 {product.price.toLocaleString()}.000 VND</p>
              <p className="text-sm text-gray-500 italic dark:text-gray-100">📦 {product.category}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => navigate(`/admin/update/${product._id}`)}
                  className="bg-blue-400 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition-all"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => confirmDelete(product)}
                  className="bg-red-400 text-white px-4 py-2 rounded-xl hover:bg-red-500 transition-all"
                >
                  🗑️ Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => {setCurrentPage(page); scrollTo(0, 0)}}
              className={`px-4 py-2 rounded-full cursor-pointer ${
                page === currentPage
                  ? "bg-pink-500 text-white"
                  : "bg-pink-300 text-white/80"
              } hover:bg-pink-400 transition-all`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal xóa */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed z-100 inset-0 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 z-20 max-w-sm w-full shadow-xl dark:bg-black"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-lg font-bold text-pink-700 text-center dark:text-pink-400">
                Xác nhận xoá sản phẩm
              </div>
              <div className="text-md text-gray-600 dark:text-gray-300 mt-2">
                Bạn có chắc chắn muốn xoá <b>{selectedProduct?.name}</b> không? Hành động này không thể hoàn tác 😥
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-green-300 rounded-lg hover:bg-green-400 text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  Huỷ
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={deleteProduct}
                >
                  Xoá
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowProduct;
