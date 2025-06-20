import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    scrollTo(0, 0)
  }, [searchTerm]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  const renderPagination = () => {
    let pages = [];

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => {setCurrentPage(i); scrollTo(0, 0)}}
          className={`px-3 py-1 mx-1 rounded cursor-pointer dark:text-black ${
            i === currentPage ? "bg-pink-500" : "bg-pink-200 hover:bg-pink-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-6">
        {currentPage > 1 && (
          <button onClick={() => {setCurrentPage((prev) => prev - 1); scrollTo(0, 0)}} className="px-3 py-1 mx-1 bg-pink-200 rounded cursor-pointer hover:bg-pink-300 text-black">
            Trước
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => {setCurrentPage((prev) => prev + 1); scrollTo(0, 0)}} className="px-3 py-1 mx-1 bg-pink-200 rounded cursor-pointer hover:bg-pink-300 text-black">
            Sau
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8 font-sans dark:text-pink-300">
        💖 Sản phẩm của trà chanh Thị Bún 💖
      </h1>

      {searchTerm && (
        <div className="text-sm text-gray-500 mb-4 text-center dark:text-gray-100">
          Kết quả cho từ khóa: <span className="font-semibold">{searchTerm}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard product={product} key={product._id}/>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default Products;
