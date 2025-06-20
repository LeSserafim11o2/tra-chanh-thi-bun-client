import logo from "../assets/ThiBun.png";
import {FaFacebook} from  "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-pink-700 py-8 px-4 mt-12 dark:bg-black/80 dark:text-pink-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        <div className="flex justify-center md:justify-start">
          <img src={logo} alt="Logo" className="h-80 object-cover" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold">Trà chanh Thị Bún</h3>
          <p className="text-md my-3">
            Tìm gì mà mệt vậy Phở? Đừng lo, Trà Chanh Thị Bún đã có mặt để giải cứu bạn đây! Với những ly trà chanh chua ngọt mát lạnh, đảm bảo xua tan mọi mệt mỏi, uể oải. Ghé ngay để 
            Thị Bún giúp bạn lấy lại năng lượng và tận hưởng cuộc sống tươi rói đi nào! Chần chừ gì nữa, tới liền Thị Phở ơi! ✨
          </p>
          <p className="text-sm mt-2">© Bản quyền được làm bởi Nam Còi 2025</p>
        </div>
        <div className="text-center lg:text-right space-y-1">
          <p>📞 0985548062 - 0943432389</p>
          <p className="inline-flex items-center gap-1">
            <FaFacebook className="text-blue-500"/> <a href="https://www.facebook.com/tra.chanh.thi.bun" target="_blank" className="hover:underline">Trà chanh Thị Bún</a>
          </p>
          <p>🏠 Số 16 ngõ 989 Tam Trinh, Hoàng Mai, Hà Nội</p>
          <p className="inline-flex items-center gap-1">
            🏪 Giờ mở cửa: 10h00 - 23h00
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;