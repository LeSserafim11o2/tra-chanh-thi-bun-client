import {Link} from "react-router-dom";

const NotFound = () => {
    return (
        <div className="bg-pink-300 mt-10 mx-auto w-96 p-5 flex flex-col gap-3 justify-center rounded-2xl">
            <img className="w-96 h-96 object-cover" src="https://i.postimg.cc/Gp4JGymV/404-error-with-landscape-concept-illustration-114360-7898.jpg" alt="Not Found" />
            <Link to={"/"} className="p-2 bg-white text-pink-500 rounded-3xl text-center">Trà Chanh Thị Bún</Link>
        </div>
    )
}

export default NotFound
