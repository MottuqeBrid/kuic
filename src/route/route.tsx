import { createBrowserRouter } from "react-router";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Gallery from "../pages/Gallery/Gallery";
import About from "../pages/About/About";
import Events from "../pages/Events/Events";
import SingleEvent from "../pages/SingleEvent/SingleEvent";
import People from "../pages/People/People";
import Blog from "../pages/Blog/Blog";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddMemberForm from "../components/Admin/Members/AddMemberForm";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/gallery",
        Component: Gallery,
      },
      {
        path: "/events",
        Component: Events,
      },
      {
        path: "/events/:id",
        Component: SingleEvent,
      },
      {
        path: "/people",
        Component: People,
      },
      {
        path: "/blog",
        Component: Blog,
      },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "add-member",
        element: <AddMemberForm />,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        element: <h1>Login</h1>,
      },
      {
        path: "register",
        element: <h1>Register</h1>,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;
