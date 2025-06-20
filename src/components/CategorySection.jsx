import { Link } from "react-router-dom";
import { categories } from "../data";

const CategorySection = () => {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-10 dark:text-pink-200">Danh mục nổi bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(({ id, name, path, image, bg }) => (
          <Link
            to={`/products/category/${path}`} key={id}
            className={`${bg} rounded-xl p-4 flex flex-col items-center justify-center shadow-md hover:scale-105 transition`}
          >
            <img src={image} alt={name} className="h-20 mb-4" />
            <span className="text-center font-semibold text-pink-700">{name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;