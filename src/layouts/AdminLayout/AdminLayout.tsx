import { Outlet } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../lib/ScrollToTop/ScrollToTop";

const AdminLayout = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <main className="min-h-screen max-w-7xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
