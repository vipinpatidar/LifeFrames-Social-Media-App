import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../utils/axios";
import axios from "axios";
export const AuthContext = createContext({
  user: {},
  login: () => {},
  isLoginUser: Boolean,
  setIsLoginUser: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [isLoginUser, setIsLoginUser] = useState(currentUser ? true : false);

  // console.log(isLoginUser);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);
  // console.log(currentUser);

  const login = async (inputs) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      setCurrentUser(data?.user);
      setIsLoginUser(true);

      // console.log(data);
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await makeRequest.post("/auth/logout");
      setIsLoginUser(false);
      localStorage.removeItem("user");
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!document.cookie) {
    logoutHandler();
  }

  const updatedUser = async () => {
    try {
      if (currentUser) {
        const { data } = await axios.get(
          `http://localhost:3000/api/users/find/${currentUser?.id}`,
          {
            withCredentials: true,
          }
        );

        // console.log(data);

        if (data) {
          setCurrentUser(data);
        }
      }
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  };

  // console.log(currentUser);
  // updatedUser();

  const context = {
    user: currentUser,
    login: login,
    isLoginUser,
    setIsLoginUser,
    updatedUser,
    logoutHandler,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
