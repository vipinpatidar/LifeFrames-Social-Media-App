import { useContext, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import LeftBar from "./components/Leftbar/Leftbar";
import RightBar from "./components/Rightbar/Rightbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import { DarkModeContext } from "./context/darkMode";
//CSS
import "./App.scss";
import "./style.scss";
import { AuthContext } from "./context/authContext";
import { makeRequest } from "./utils/axios.js";

function App() {
  const { isDark } = useContext(DarkModeContext);

  const { isLoginUser, logoutHandler } = useContext(AuthContext);

  const isDarkMode = isDark;

  // console.log(isLoginUser);

  const Layout = () => {
    return (
      <div className={`subRoot ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <Navbar logoutHandler={logoutHandler} />
        <div className="layout">
          <LeftBar />
          <div className="layout_middle">
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoginUser) {
      return <Navigate to={"/login"} />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
