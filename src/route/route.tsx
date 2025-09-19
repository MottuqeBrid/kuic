import { createBrowserRouter } from "react-router";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Gallery from "../components/Gallery/Gallery";
import About from "../components/About/About";
import Events from "../components/Events/Events";
import SingleEvent from "../components/SingleEvent/SingleEvent";
import People from "../components/People/People";
import Blog from "../components/Blog/Blog";

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
