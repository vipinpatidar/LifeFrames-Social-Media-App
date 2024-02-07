import React, { useContext } from "react";
import { useQuery } from "react-query";
import "./posts.scss";
import Post from "../Post/Post";
//Default url
import { makeRequest } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";

const Posts = ({ openProfileId }) => {
  const navigate = useNavigate();
  const { isLoginUser } = useContext(AuthContext);

  const {
    isLoading,
    error,
    data: posts,
  } = useQuery("posts", async () => {
    if (isLoginUser) {
      const res = await makeRequest.get(
        `/posts/get?openProfileId=${openProfileId}`
      );
      return res.data.posts;
    }
  });

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }

  if (error?.response?.status === 401) {
    navigate("/login");
  }

  if (error) {
    return (
      <h1 className="error" style={{ textAlign: "center" }}>
        OOPS! Something went wrong.
      </h1>
    );
  }

  // console.log(posts);

  return (
    <div className="posts">
      {posts && posts.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
};

export default Posts;
