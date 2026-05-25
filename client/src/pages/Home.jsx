import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import FeaturedAuctions from '../components/FeaturedAuctions';
import PopularCategories from '../components/PopularCategories';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedAuctions />
      <PopularCategories />
      <HowItWorks />
    </>
  );
};

export default Home;
