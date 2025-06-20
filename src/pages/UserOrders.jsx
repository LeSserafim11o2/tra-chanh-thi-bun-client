import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/user/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        toast.error("Không thể tải lịch sử đơn hàng", err);
      }
    };

    if (user?._id) fetchMyOrders();
  }, [user]);

  if (!user) return <p className="text-center mt-10 text-pink-600">Cậu cần đăng nhập để xem đơn hàng 💳</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-pink-600 mb-4 dark:text-pink-300">Lịch sử đơn hàng của tớ 🍒</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-100">Không có đơn hàng nào 😢</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-white shadow-md border border-pink-200 p-4 rounded-xl mb-4 dark:bg-black/80">
            <div className="flex justify-between items-center">
              <p className="text-pink-700 font-medium dark:text-pink-400">Trạng thái: {order.status}</p>
              <p className="text-sm text-gray-500 dark:text-gray-100">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <ul className="list-disc ml-5 mt-2 text-gray-700 dark:text-gray-300">
              {order.items.map(item => (
                <li key={item._id}>{item.product?.name} x {item.quantity} — {item.price * item.quantity}K</li>
              ))}
            </ul>
            <div className="mt-2 text-pink-600 dark:text-pink-300">
              <p>Phí ship: {order.shippingFee}K</p>
              <p>Tổng cộng: {order.total}K</p>
              <p>Phương thức thanh toán: {order.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</p>
              {order.note && <p>Ghi chú: {order.note}</p>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrderHistory;
