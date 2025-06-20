import { Link } from "react-router-dom";
import heroBg from "../assets/ThiBunBanner1.jpg";

const HeroSection = () => {
  return (
    <section
      className="h-96 xl:h-[90vh] bg-cover bg-center flex items-center justify-center text-center px-4"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="bg-white/70 dark:bg-black/70 p-8 rounded-xl shadow-lg max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-pink-700 mb-6 dark:text-pink-400">
          Ở đây có trà sữa ngon hơn người yêu cũ của bạn!!!
        </h1>
        <Link
          to="/products"
          className="inline-block mt-4 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition dark:bg-pink-300 dark:hover:bg-pink-400"
        >
          Xem ngay
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;