import { Outlet } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../lib/ScrollToTop/ScrollToTop";

const HomeLayout = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <main className="max-w-7xl mx-auto min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
