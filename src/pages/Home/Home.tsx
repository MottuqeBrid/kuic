import Hero from "../../components/Hero/Hero";
import OurSegments from "../../components/OurSegments/OurSegments";
import UpcomingEvent from "../../components/UpcomingEvent/UpcomingEvent";

const Home = () => {
  return (
    <div className="space-y-2">
      <Hero />
      <UpcomingEvent />
      <OurSegments />
    </div>
  );
};

export default Home;
