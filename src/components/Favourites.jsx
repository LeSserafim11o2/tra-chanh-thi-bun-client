import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const FavoritesPage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoriteProducts(res.data);
    };
    fetch();
  }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 w-[90%] mx-auto'>
      {favoriteProducts.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
};

export default FavoritesPage;
