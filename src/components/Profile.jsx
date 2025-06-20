import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { hanoiDistricts } from "../data";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AvatarDefault from "../assets/AvatarDefault.jpg";

const Profile = () => {
    const { user, login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(AvatarDefault);
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [street, setStreet] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setAvatarPreview(user.avatar || AvatarDefault);
            setDistrict(user?.address?.district || "");
            setWard(user?.address?.ward || "");
            setStreet(user?.address?.street || "");
        }
    }, [user]);

    const wards = hanoiDistricts[district] || [];

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "tra_chanh_thi_bun");
        const res = await fetch(import.meta.env.VITE_CLOUNDIARY_URL, { method: "POST", body: formData });
        const data = await res.json();
        return data.secure_url;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            let avatarUrl = user.avatar;
            if (avatarFile) {
                avatarUrl = await uploadImageToCloudinary(avatarFile);
            }
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username,
                    currentPassword,
                    password,
                    avatar: avatarUrl,
                    address: { street, ward, district },
                }),
            });
            const updatedUser = await res.json();
            login(updatedUser, token);
            toast.success(" Cập nhật thành công!");
            window.location.reload();
        } catch (err) {
            toast.error(" Có lỗi khi cập nhật!", err);
        }
    };

    if (!user) return <p className="text-center mt-10">Đang tải hồ sơ người dùng...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-black/80 rounded-2xl shadow-xl mt-10">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-6 text-center">🌸 Chỉnh sửa tài khoản 🌸</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="font-semibold">Tên người dùng</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 border rounded focus:outline-none" />
                </div>

                <div>
                    <label className="font-semibold">Số điện thoại</label>
                    <input type="text" value={user.phone} disabled className="w-full mt-1 p-2 border rounded bg-gray-300 dark:bg-gray-600" />
                </div>

                <div>
                    <label className="font-semibold">Mật khẩu hiện tại</label>
                    <div className="flex items-center relative">
                        <input type={showCurrentPass ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} 
                        className="w-full mt-1 p-2 border rounded" />
                        <span onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-2 cursor-pointer">
                            {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="font-semibold">Mật khẩu mới</label>
                    <div className="flex items-center relative">
                        <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
                        <span onClick={() => setShowPass(!showPass)} className="absolute right-2 cursor-pointer">
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="font-semibold">Ảnh đại diện</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                    }} className="w-full mt-1 bg-pink-200 p-3 dark:text-black" />
                    {avatarPreview && (
                        <img src={avatarPreview} alt="Avatar preview" className="w-30 h-30 rounded-full mt-2 object-cover block mx-auto" />
                    )}
                </div>

                <div>
                    <label className="font-semibold">Quận</label>
                    <select className="w-full mt-1 p-2 border rounded" value={district} onChange={(e) => {
                        setDistrict(e.target.value);
                        setWard("");
                    }}>
                        <option value="" className="dark:bg-black">-- Chọn quận --</option>
                        {Object.keys(hanoiDistricts).map((d, i) => (
                            <option key={i} value={d} className="dark:bg-black">{d}</option>
                        ))}
                    </select>
                </div>

                {district && (
                    <div>
                        <label className="font-semibold">Phường</label>
                        <select className="w-full mt-1 p-2 border rounded" value={ward} onChange={(e) => setWard(e.target.value)}>
                            <option value="" className="dark:bg-black">-- Chọn phường --</option>
                            {wards.map((w, i) => (
                                <option key={i} value={w} className="dark:bg-black">{w}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="font-semibold">Số nhà, tên phố</label>
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full mt-1 p-2 border rounded" />
                </div>

                <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition">Lưu thay đổi</button>
            </form>
        </div>
    );
};

export default Profile;
