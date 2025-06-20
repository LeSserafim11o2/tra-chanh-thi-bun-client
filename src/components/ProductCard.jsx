import { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useFavorites } from '../context/FavoritesContext';

const ProductCard = ({ product }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isLiked = favorites.includes(product._id);
  const [quantity, setQuantity] = useState(0);
  const { cartItems, addToCart } = useCart();

  const toggleLike = () => {
    if (isLiked) removeFavorite(product._id);
    else addFavorite(product._id);
  };

  useEffect(() => {
    const currentQty = cartItems[product._id] || 0;
    setQuantity(currentQty);
  }, [cartItems, product._id]);

  const increase = () => addToCart(product._id, 1);
  const decrease = () => addToCart(product._id, -1);
  const addToCartHandler = () => addToCart(product._id, 1);

  return (
    <div className="relative bg-white/80 dark:bg-black/70 rounded-xl shadow-md p-4 hover:shadow-lg transition border-2 border-solid border-pink-300">
      <motion.button
        className={`absolute top-2 right-2 text-2xl cursor-pointer ${isLiked ? "text-pink-400" : "text-gray-400"}`}
        onClick={toggleLike}
        whileTap={{ scale: 1.3 }}
        animate={{ scale: isLiked ? 1.2 : 1, opacity: isLiked ? 1 : 0.7 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <FaHeart />
      </motion.button>
      <img src={product.image} alt={product.name} className="w-full h-60 md:h-80 xl:h-72 object-cover rounded" />
      <div className="mt-4 space-y-1">
        <p className="text-md text-pink-500 font-semibold dark:text-pink-200">{product.category}</p>
        <h3 className="font-bold text-lg text-pink-700 dark:text-pink-400 h-14">{product.name}</h3>
        <p className="text-md text-gray-600 dark:text-amber-50">{product.price}K</p>
        <div className="flex gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
        </div>
        <div className='grid gap-2 grid-cols-2'>
          <Link to={`/products/${product.slug}`} className='mt-3 w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 text-center'>Xem chi tiết</Link>
          {quantity === 0 ? (
            <button
              onClick={addToCartHandler}
              className={`mt-3 w-full text-white py-2 rounded-full ${product.inStock === false ? "bg-gray-400" : "bg-pink-400 hover:bg-pink-500"}`}
              disabled={product.inStock === false}
            >
              Thêm
            </button>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-3 bg-red-400 rounded-full">
              <button onClick={decrease} className="bg-gray-200 px-2 py-1 rounded-full cursor-pointer dark:text-black"><FaMinus /></button>
              <span className="text-white/80 font-bold">{isNaN(quantity) ? 0 : quantity}</span>
              <button onClick={increase} className="bg-gray-200 px-2 py-1 rounded-full cursor-pointer dark:text-black"><FaPlus /></button>
            </div>
          )}
        </div>
      </div>
      {product.inStock === false && (<p className='absolute top-2 left-2 bg-pink-500 dark:bg-pink-400 text-white rounded-xl py-1 px-2'>Hết hàng</p>)}
    </div>
  );
};

export default ProductCard;
