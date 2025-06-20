import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaMinus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import EmptyCardImage from "../assets/EmptyCart.webp";

const Cart = () => {
    const { user } = useAuth();
    const { cartItems, addToCart, clearCart } = useCart();
    const [products, setProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [shipping, setShipping] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const ids = Object.keys(cartItems);
            const responses = await Promise.all(ids.map(id => axios.get(`${import.meta.env.VITE_BACKEND_URL}/${id}`)));
            setProducts(responses.map(res => res.data));
        } catch (err) {
            toast.error("Lỗi khi tải sản phẩm", err);
        }
        };
        if (Object.keys(cartItems).length > 0) fetchProducts();
    }, [cartItems]);

    const calculateShippingFee = (address) => {
        const { district } = address;
        if (!district) return 30;
    
        const innerHN = ['Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên'];
        if (innerHN.includes(district)) return 10;
        if (district.includes("Hà Đông")) return 20;
    
        return 30;
    };

    useEffect(() => {
        if (user && products.length > 0) {
            const total = getTotal();
            const shippingFee = calculateShippingFee(user.address);
            setShipping(shippingFee);
            setFinalTotal(total + shippingFee);
        }
    }, [user, products]);

    const getTotal = () => {
        return products.reduce((acc, p) => {
            const qty = cartItems[p._id];
            return qty > 0 ? acc + p.price * qty : acc;
        }, 0);
    };

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, {
                cartItems,
                phone: user.phone,
                paymentMethod,
                note,
            });
            setShipping(res.data.shipping);
            setFinalTotal(res.data.finalTotal);
            toast.success("Thanh toán thành công!");
            clearCart();
            navigate("/user/orders"); 
        } catch (err) {
            toast.error("Thanh toán thất bại", err);
        } finally {
            setIsLoading(false);
        }
    };

    const visibleProducts = products.filter(p => cartItems[p._id] > 0);

    if (visibleProducts.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center h-screen bg-pink-50 dark:bg-black/80 text-pink-500 object-cover">
            <img src={EmptyCardImage} alt="Giỏ hàng trống" className="w-72 h-72 mb-6"/>
            <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition shadow-md dark:bg-pink-200 dark:hover:bg-pink-300 dark:text-black"
            >
                Ghé thực đơn mua đồ nào!
            </button>
        </div>
        );
    }

    if (!user) {
        return <p className="text-center text-pink-600 dark:text-pink-300">Vui lòng đăng nhập để thanh toán nhé 😭</p>
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-pink-600 dark:text-pink-300">Giỏ hàng của cậu 🍹</h2>
            <table className="w-full text-left border rounded-xl overflow-hidden shadow">
            <thead className="bg-pink-100 text-pink-700 dark:text-pink-400 dark:bg-black/50">
                <tr>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Số lượng</th>
                <th className="p-3">Tổng giá</th>
                </tr>
            </thead>
            <tbody>
                {products
                .filter(p => cartItems[p._id] > 0)
                .map(p => (
                    <tr key={p._id} className="border-b dark:bg-black/30">
                    <td className="p-3 font-medium text-pink-800 dark:text-pink-500">{p.name}</td>
                    <td className="p-3">
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => addToCart(p._id, -1)}
                            className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300 dark:text-black"
                        ><FaMinus /></button>
                        <span className="text-pink-600 font-bold dark:text-pink-300">{cartItems[p._id]}</span>
                        <button
                            onClick={() => addToCart(p._id, 1)}
                            className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300 dark:text-black"
                        ><FaPlus /></button>
                        </div>
                    </td>
                    <td className="p-3 text-pink-700 dark:text-pink-400">
                        {p.price * cartItems[p._id]}.000 VND
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>

        <div className="space-y-4 bg-pink-50 rounded-xl p-6 shadow dark:bg-black/70">
            <h2 className="text-xl font-bold text-pink-600 dark:text-pink-300">Thông tin khách hàng</h2>
            <p><strong>Tên:</strong> {user.username}</p>
            <p><strong>SĐT:</strong> {user.phone}</p>
            <p><strong>Địa chỉ:</strong> {user.address.street}, {user.address.ward}, {user.address.district}</p>

            <label className="block mt-4">
            <span className="text-pink-600 font-medium dark:text-pink-300">Phương thức thanh toán:</span>
            <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mt-1 w-full p-2 rounded-md border border-pink-300"
            >
                <option value="cash" className="dark:bg-black">Tiền mặt</option>
                <option value="bank"  className="dark:bg-black">Chuyển khoản ngân hàng</option>
            </select>
            {paymentMethod === "bank" && (
            <div className="mt-2 text-sm text-pink-700 bg-pink-100 p-3 rounded-md border border-pink-200 dark:text-pink-400 dark:bg-black/40">
                <p><strong>Chủ tài khoản:</strong> NGUYEN THU HANH</p>
                <p><strong>Số tài khoản:</strong> 0985548062</p>
                <p><strong>Ngân hàng:</strong> MB Bank - Ngân hàng Quân Đội</p>
            </div>
            )}
            </label>

            <label className="block mt-4">
            <span className="text-pink-600 font-medium dark:text-pink-300">Ghi chú cho cửa hàng:</span>
            <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows="3"
                className="w-full p-2 border border-pink-300 rounded-md"
            />
            </label>

            <div className="text-pink-600 dark:text-pink-300">
                <p className="mb-1"><strong>Tiền hàng:</strong> {getTotal()}K</p>
                <p className="mb-1"><strong>Phí ship:</strong> {shipping}K</p>
                <p className="text-lg font-bold text-pink-700 dark:text-pink-400">
                    Tổng cộng: {finalTotal}.000 VND
                </p>
            </div>

            <button
            onClick={handleCheckout}
            className="w-full py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
            >
                {isLoading ? "Đang gửi đơn..." : "Xác nhận thanh toán 💸"}
            </button>
        </div>
        </div>
    );
};

export default Cart;
