import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { categories } from "../data";

const ProductCategory = () => {
    const { path } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`);
            const matchedCategory = categories.find((category) => category.path === path);
            if (!matchedCategory) {
                return (<div className="text-center text-red-500 py-10">Không tìm thấy danh mục phù hợp với đường dẫn: <strong>{path}</strong></div>);
            }
            const categoryName = matchedCategory?.name;
            const filtered = res.data.filter(
                (item) => item.category === categoryName
            );
            setProducts(filtered);
        } catch (err) {
            console.error("Lỗi lấy sản phẩm theo loại", err);
        } finally {
            setLoading(false);
        }
    };
        fetchProducts();
    }, [path]);

    const categoryTitle = categories.find((category) => category.path === path)?.name;

    if (loading) return <p className="text-center text-pink-500">Đang tải sản phẩm...</p>;

    return (
        <div>
            <div className="max-w-screen-xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center dark:text-pink-200">
                    🍹 Sản phẩm: {categoryTitle || "Không tìm thấy"}
                </h2>

                {products.length === 0 ? (
                    <p className="text-center text-gray-500">Không có sản phẩm nào trong danh mục này 😢</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCategory
