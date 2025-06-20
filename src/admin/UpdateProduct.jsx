import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    image: "",
    category: "",
    description: [""],
    inStock: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDescriptionChange = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData({ ...formData, description: newDescription });
  };

  const addDescriptionField = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ""],
    });
  };

  const handleRemoveDescription = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      description: prevData.description.filter((_, idx) => idx !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/${id}`, formData);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Cập nhật sản phẩm thất bại!");
      console.error("Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-black/80 rounded-xl shadow-md mt-8">
      <Link to={"/admin/products"} className="bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all px-5 py-2 text-md absolute top-20 left-5">Trở lại</Link>
      <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-300 mb-4">🛠️ Cập nhật sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
          required
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Giá (VND)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
          required
        />

        <input
          type="text"
          name="image"
          placeholder="URL hình ảnh"
          value={formData.image}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-xl p-2"
          required
        >
          <option value="" className="dark:bg-black">Chọn danh mục</option>
          <option value="Trà trái cây" className="dark:bg-black">Trà trái cây</option>
          <option value="Cà phê" className="dark:bg-black">Cà phê</option>
          <option value="Nước ép" className="dark:bg-black">Nước ép</option>
          <option value="Trà sữa" className="dark:bg-black">Trà sữa</option>
          <option value="Đồ đá xay đặc biệt" className="dark:bg-black">Đồ đá xay đặc biệt</option>
          <option value="Sữa chua" className="dark:bg-black">Sữa chua</option>
          <option value="Topping" className="dark:bg-black">Topping</option>
          <option value="Món ăn vặt" className="dark:bg-black">Món ăn vặt</option>
        </select>

        <div>
          <label className="font-medium">Mô tả:</label>
          {formData.description.map((desc, index) => (
            <div key={index} className="flex items-center justify-center gap-2 mt-2">
              <input type="text" value={desc} onChange={(e) => handleDescriptionChange(index, e.target.value)}
                placeholder={`Mô tả #${index + 1}`} className="w-full border rounded-xl p-2" required/>
              <MdDelete className="text-3xl text-red-400 cursor-pointer" onClick={() => handleRemoveDescription(index)}/>
            </div>
          ))}
          <button
            type="button"
            onClick={addDescriptionField}
            className="mt-2 text-sm text-pink-500 dark:text-pink-200 hover:underline"
          >
            + Thêm mô tả
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium">Còn hàng:</label>
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="w-5 h-5 accent-pink-500 dark:accent-pink-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition-all dark:bg-pink-200 dark:hover:bg-pink-300 dark:text-black"
        >
          💾 Lưu cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
