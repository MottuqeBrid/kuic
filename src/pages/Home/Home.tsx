import Hero from "../../components/Hero/Hero";
import UpcomingEvent from "../../components/UpcomingEvent/UpcomingEvent";

const Home = () => {
  return (
    <div className="space-y-2">
      <Hero />
      <UpcomingEvent />
    </div>
  );
};

export default Home;
