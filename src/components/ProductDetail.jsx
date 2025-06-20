import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaMinus } from "react-icons/fa";
import {useCart} from "../context/CartContext";
import ProductComments from "./ProductComment";

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/slug/${slug}`);
            setProduct(res.data)
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm", err);
        }
        };
        fetchProduct();
    }, [slug]);

    const handleAdd = () => {
        setQuantity(1);
        addToCart(product._id, 1);
    };

    const increase = () => {
        setQuantity((prev) => prev + 1);
        addToCart(product._id, 1);
    };

    const decrease = () => {
        setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
        addToCart(product._id, -1);
    };

    if (!product) {
        return <p className="text-center text-pink-500">Đang tải sản phẩm...</p>;
    }

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                    <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover shadow-md max-h-[600px]"/>
                </div>

                <div className="space-y-5">
                    <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-300">{product.name}</h1>
                    <p className="text-xl text-gray-700 font-semibold dark:text-gray-300">{product.price}K</p>
                    <p className="text-md text-gray-500 dark:text-gray-100">Loại: <span className="text-pink-500 dark:text-pink-200">{product.category}</span></p>

                    <div>
                        <p className="font-semibold mb-2 text-pink-600 dark:text-pink-300">Mô tả:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-200">
                            {product.description.map((desc, index) => (
                                <li key={index} className="text-xl">{desc}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4">
                    {quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className={`w-full text-white py-2 rounded-full ${product.inStock === false ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600 dark:bg-pink-200 dark:hover:bg-pink-300 dark:text-black/90"}`}
                            disabled={product.inStock === false}
                            >
                            Thêm vào giỏ
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-4 bg-red-400 py-1 rounded-full">
                            <button onClick={decrease} className="bg-gray-200 p-2 rounded-full dark:text-black">
                                <FaMinus />
                            </button>
                            <span className="text-lg font-bold text-white/50">{quantity}</span>
                            <button onClick={increase} className="bg-gray-200 p-2 rounded-full dark:text-black">
                                <FaPlus />
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            <ProductComments productId={product._id}/>
        </>
    );
};

export default ProductDetail;
