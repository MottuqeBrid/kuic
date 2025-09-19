import { Outlet } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const HomeLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
