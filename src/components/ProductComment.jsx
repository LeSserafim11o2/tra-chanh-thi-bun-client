import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import moment from "moment";
import "moment/dist/locale/vi";
moment.locale("vi");

const ProductComments = ({ productId }) => {
    const { user, token } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [limit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    const fetchComments = async (append = false) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${productId}?skip=${skip}&limit=${limit}`);
        if (append) {
        setComments((prev) => [...prev, ...res.data.comments]);
        } else {
        setComments(res.data.comments);
        }
        setTotalComments(res.data.totalCount);
    } catch (err) {
        console.error("Error fetching comments:", err);
        toast.error("Lỗi khi lấy bình luận");
    }
    };

    useEffect(() => {
        fetchComments();
        setComments([]);
        setSkip(0);
        setTotalComments(0);
    }, [productId]);

    const handleLoadMore = () => {
        setSkip((prev) => prev + limit);
    };

    useEffect(() => {
        if (skip !== 0) {
            fetchComments(true);
        } else {
            fetchComments();
        }
    }, [skip]);

    const handleAdd = async () => {
        if (!newComment.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận");
            return;
        }
        
        if (rating < 1 || rating > 5) {
            toast.error("Vui lòng chọn đánh giá từ 1 đến 5 sao");
            return;
        }

        if (!user || !token) {
            toast.error("Vui lòng đăng nhập để bình luận");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/comments`,
                {
                    product: productId,
                    content: newComment.trim(),
                    rating: rating
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            
            console.log("Comment added successfully:", response.data);
            setNewComment("");
            setRating(0);
            toast.success("Gửi bình luận thành công!");
            fetchComments();
        } catch (err) {
            console.error("Error adding comment:", err);
            
            if (err.response?.status === 401) {
                toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            } else if (err.response?.status === 400) {
                toast.error("Dữ liệu không hợp lệ");
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Lỗi khi gửi bình luận");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Xóa bình luận thành công!");
            fetchComments();
        } catch (err) {
            console.error("Error deleting comment:", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Lỗi khi xóa bình luận");
            }
        }
    };

    const handleEdit = async (id) => {
        if (!editingText.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận");
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/comments/${id}`,
                { content: editingText.trim() },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEditingId(null);
            setEditingText("");
            toast.success("Cập nhật bình luận thành công!");
            fetchComments();
        } catch (err) {
            console.error("Error updating comment:", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Lỗi khi cập nhật bình luận");
            }
        }
    };

    

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 border-t">
            <h2 className="text-xl font-bold mb-4 text-pink-600 dark:text-pink-300">Bình luận</h2>

            {user && (
                <div className="flex flex-col gap-3 mb-6">
                    <textarea
                        className="border p-2 rounded resize-none"
                        rows={3}
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <div className="flex gap-2 items-center">
                        <span className="text-xl font-semibold">Đánh giá sản phẩm:</span>
                        <div className="flex gap-1 items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star} 
                                    onClick={() => !isSubmitting && setRating(star)}
                                    className={`cursor-pointer text-xl ${
                                        star <= rating ? "text-yellow-400" : "text-gray-300"
                                    } ${isSubmitting ? "cursor-not-allowed" : "hover:text-yellow-300"}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        {rating > 0 && (
                            <span className="text-xl text-gray-600 dark:text-gray-200">
                                ({rating} sao)
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={isSubmitting}
                        className={`self-end px-4 py-2 rounded text-white ${
                            isSubmitting 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-pink-500 hover:bg-pink-600 dark:bg-pink-200 dark:hover:bg-pink-300 dark:text-black/90"
                        }`}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {comments.map((c) => (
                    <div key={c._id}
                        className="bg-white dark:bg-black/80 p-4 rounded shadow border relative"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <img
                                src={c.user.avatar || "https://i.postimg.cc/x83kpBRy/Avatar-Default.jpg"}
                                className="w-16 h-16 rounded-full object-cover"
                                alt={c.user.username}
                            />
                            <div>
                                <p className="font-semibold">{c.user.username}</p>
                                <p className="text-xs text-gray-400">
                                    {moment(c.createdAt).fromNow()}
                                </p>
                                {c.rating && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">
                                            {"★".repeat(c.rating)}
                                        </span>
                                        <span className="text-gray-400">
                                            {"☆".repeat(5 - c.rating)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {editingId === c._id ? (
                            <>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    rows={2}
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleEdit(c._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditingText("");
                                        }}
                                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Huỷ
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-700 text-sm dark:text-gray-300">{c.content}</p>
                        )}

                        {(user?._id === c.user._id || user?.role === "admin") && editingId !== c._id && (
                            <div className="absolute right-3 top-3 flex gap-2">
                                {user?._id === c.user._id && (
                                    <button onClick={() => {setEditingId(c._id); setEditingText(c.content)}} className="bg-green-500 text-sm rounded-2xl px-3 py-1 hover:bg-green-600">
                                        Sửa
                                    </button>
                                )}
                                <button onClick={() => handleDelete(c._id)} className="bg-red-500 text-sm rounded-2xl px-3 py-1 hover:bg-red-600">
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {comments.length < totalComments && (
                <div className="text-center mt-4">
                    <button
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded"
                    >
                    Xem thêm bình luận
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductComments;