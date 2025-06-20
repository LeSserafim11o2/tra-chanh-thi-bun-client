import CategorySection from "../components/CategorySection"
import HeroSection from "../components/HeroSection"
import LetterSection from "../components/LetterSection"
import ProductList from "../components/ProductList"

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <CategorySection/>
      <ProductList/>
      <LetterSection/>
    </div>
  )
}

export default Home
