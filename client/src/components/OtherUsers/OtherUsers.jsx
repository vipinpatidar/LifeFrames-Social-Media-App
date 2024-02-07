import React, { useContext } from "react";
import "./otherUsers.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "react-query";
import { makeRequest } from "../../utils/axios";
import { Link } from "react-router-dom";

const OtherUsers = () => {
  const { isLoginUser } = useContext(AuthContext);

  const {
    isLoading,
    error,
    data: allUsers,
  } = useQuery("allUsers", async () => {
    if (isLoginUser) {
      const res = await makeRequest.get("/users/all");
      return res.data;
    }
  });

  // console.log(allUsers);

  return (
    <div className="otherUsersBlock">
      <h1 className="otherUserHeading">FOLLOW OTHER USERS</h1>
      <div className="otherUsers">
        {!isLoading &&
          allUsers?.map((user) => (
            <Link to={`/profile/${user.id}`} className="story" key={user.id}>
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                  user.profilePic
                }`}
                alt="profile img"
              />
              <span>{user.name}</span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default OtherUsers;
