import LoadingGif from "../assets/LoadingGif.gif";

const LoadingScreen = () => {
    return(
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-pink-200 text-center">
            <img src={LoadingGif} alt="Bún đang quay~" className="w-96 h-96 mb-4 object-cover" />
            <p className="text-xl font-semibold text-pink-700 animate-pulse">
                Đang tải... chờ Bún một xíu nha~ 🍋🧋
            </p>
        </div>
    )
}

export default LoadingScreen;