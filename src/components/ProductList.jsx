import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const productSlice = products.slice(0, 8);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-200 mb-10">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {productSlice.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
      <Link to={"/products"} 
      className="block max-w-50 mx-auto text-center mt-5 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition dark:bg-pink-300 dark:hover:bg-pink-400">
      Xem thêm
      </Link>
    </section>
  );
};

export default ProductList;