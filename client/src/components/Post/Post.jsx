import React, { useState, useContext } from "react";
import moment from "moment";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../Comments/Comments";
//CSS
import "./post.scss";
// React query
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../utils/axios.js";
import { AuthContext } from "../../context/authContext.jsx";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { user, isLoginUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  /*============ GET LIKES ================= */
  // here data is userId or user who liked this post
  const {
    isLoading,
    error,
    data: likes,
  } = useQuery(["likes", post.id], async () => {
    if (isLoginUser) {
      const res = await makeRequest.get(`/likes/get?postId=${post.id}`);
      return res.data;
    }
  });

  /*============ POST LIKES ================= */
  /*============ DELETE LIKES ================= */

  const mutation = useMutation(
    (isLiked) => {
      if (!isLiked) {
        return makeRequest.post("/likes/add", { postId: post.id });
      } else {
        return makeRequest.delete(`/likes/remove?postId=${post.id}`);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const likePostHandler = () => {
    mutation.mutate(likes.includes(user.id));
  };

  /*============ DELETE POST ================= */

  const openCloseDeleteMenu = () => {
    setIsDeleteOpen((prevState) => !prevState);
  };

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete(`/posts/delete/${postId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const deletePostHandler = () => {
    deleteMutation.mutate(post.id);
  };

  // console.log(likes);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                post.profilePic
              }`}
              alt=""
            />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          {post.userId === user.id ? (
            <div className="deletePostDiv">
              <MoreHorizIcon
                onClick={openCloseDeleteMenu}
                style={{ cursor: "pointer" }}
              />
              {isDeleteOpen && (
                <button onClick={deletePostHandler}>Delete</button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="content">
          <p>{post?.description}</p>
          {post?.image && (
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${post?.image}`}
              alt="post image"
            />
          )}
        </div>
        <div className="info">
          <div className="item">
            {!isLoading && likes.includes(user.id) ? (
              <FavoriteOutlinedIcon
                className="favorite"
                onClick={likePostHandler}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={likePostHandler} />
            )}
            {likes?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
