import { Outlet } from "react-router";
import ScrollToTop from "../../lib/ScrollToTop/ScrollToTop";

const AuthLayout = () => {
  return (
    <div>
      <ScrollToTop />
      {/* Main content */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
