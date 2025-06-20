import background from "../assets/ThiBunBanner2.jpg";

const LetterSection = () => {
  return (
    <section
      className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-center"
      style={{backgroundImage: `url(${background})`}}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center text-pink-400 space-y-4 px-4 dark:text-pink-200">
        <h1 className="text-4xl md:text-5xl font-bold">Chào mừng đến với Trà Chanh Thị Bún</h1>
        <p className="text-xl md:text-2xl font-medium">Nơi thưởng thức trà chanh mát lạnh cho mọi lứa tuổi 💖</p>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm md:text-base font-medium">
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">🚚 Giao hàng siêu tốc</div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">💎 Chất lượng đảm bảo</div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">💖 Uy tín hàng đầu</div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">💰 Giá cả hợp túi</div>
        </div>
      </div>
    </section>
  );
};

export default LetterSection;
