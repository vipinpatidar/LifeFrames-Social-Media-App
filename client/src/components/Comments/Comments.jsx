import React, { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
//React query
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../utils/axios.js";
import moment from "moment";

const Comments = ({ postId }) => {
  const [description, setDescription] = useState("");
  const { user, isLoginUser } = useContext(AuthContext);

  /*================== GET COMMENTS================= */

  const {
    isLoading,
    data: comments,
    error,
  } = useQuery("comments", async () => {
    if (isLoginUser) {
      const res = await makeRequest.get(`/comments/get?postId=${postId}`);
      return res.data;
    }
  });

  /*================== POST COMMENTS================= */

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      makeRequest.post("/comments/add", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const sendCommentHandler = () => {
    mutation.mutate({
      description: description,
      postId: postId,
    });

    setDescription("");
  };

  // console.log(comments);

  return (
    <div className="comments">
      <div className="write">
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/uploads/${user.profilePic}`}
          alt="user image"
        />
        <input
          type="text"
          placeholder="write a comment"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={sendCommentHandler}>Send</button>
      </div>

      {isLoading && (
        <h1 className="loading" style={{ fontSize: "16px" }}>
          Loading...
        </h1>
      )}

      {error && (
        <h1 className="error" style={{ textAlign: "center" }}>
          OOPS! Something went wrong.
        </h1>
      )}

      {!error && !isLoading && comments.length > 0 ? (
        comments?.map((comment) => (
          <div className="comment" key={comment.id}>
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                comment.profilePic
              }`}
              alt=""
            />
            <div className="infoCom">
              <span>{comment.name}</span>
              <p>{comment.description}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      ) : (
        <div className="noComment">
          <p>No comments</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
