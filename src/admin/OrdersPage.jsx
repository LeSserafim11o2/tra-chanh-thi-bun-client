import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`);
        setOrders(res.data);
        } catch (err) {
        toast.error("Không thể tải đơn hàng", err);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, { status: newStatus });
        toast.success("Đã cập nhật trạng thái đơn hàng");
        fetchOrders();
        } catch (err) {
        toast.error("Cập nhật thất bại", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Cậu có chắc muốn xoá đơn hàng này không? 😥")) {
            try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`);
            toast.success("Đã xoá đơn hàng");
            fetchOrders();
            } catch (err) {
            toast.error("Xoá thất bại", err);
            }
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-pink-600 mb-4 dark:text-pink-300">Đơn hàng của khách 🧃</h1>
        {orders.map(order => (
            <div key={order._id} className="bg-white shadow rounded-xl p-4 mb-6 border border-pink-200 dark:bg-black/80">
                <div className="flex items-start flex-col sm:justify-between sm:flex-row">
                    <div className="text-left">
                        <p><strong>Khách:</strong> {order.user?.username} ({order.user?.phone})</p>
                        <p><strong>Thanh toán:</strong> {order.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</p>
                        <p><strong>Địa chỉ:</strong> {order.user?.address?.street}, {order.user?.address?.ward}, {order.user?.address?.district}</p>
                        <p><strong>Ghi chú:</strong> {order.note || "Không có"}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p><strong>Phí ship:</strong> {order.shippingFee}K</p>
                        <p><strong>Tổng cộng:</strong> {order.total}K</p>
                        <select
                            value={order.status}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            className="mt-2 px-3 py-1 border rounded-md bg-pink-50 border-pink-300 text-pink-700"
                        >
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đang giao">Đang giao</option>
                            <option value="Đã giao">Đã giao</option>
                            <option value="Đã huỷ">Đã huỷ</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="font-medium text-pink-600 dark:text-pink-300">Sản phẩm:</p>
                    <ul className="list-disc ml-6">
                    {order.items.map(item => (
                        <li key={item._id}>{item.product?.name} x {item.quantity} — {item.price * item.quantity}K</li>
                    ))}
                    </ul>
                </div>
                <p className="text-sm text-gray-500 mt-2 dark:text-gray-100">Đặt lúc: {new Date(order.createdAt).toLocaleString()}</p>
                <button
                    onClick={() => handleDelete(order._id)}
                    className="mt-2 text-sm text-red-400 underline hover:text-red-500"
                    >
                    Xoá đơn hàng
                </button>
            </div>
        ))}
        </div>
    );
};

export default AdminOrdersPage;
