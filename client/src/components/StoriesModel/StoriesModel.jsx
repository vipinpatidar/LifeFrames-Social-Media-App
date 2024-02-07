import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../utils/axios";

//CSS
import "./storiesModel.scss";
import { AuthContext } from "../../context/authContext";
const StoriesModel = ({ setIsOpen }) => {
  const [storyPic, setStoryPic] = useState(null);
  const [isCover, setIsCover] = useState(true);

  const queryClient = useQueryClient();

  const { user, isLoginUser } = useContext(AuthContext);

  // console.log(user);

  const changeImageFit = () => {
    setIsCover((prevState) => !prevState);
  };

  //Upload image
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("postImg", storyPic);

      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  /*============== POST STORIES ==================== */

  const mutation = useMutation(
    (image) => {
      if (image.isPost) {
        return makeRequest.post("/stories/add", image);
      } else {
        return makeRequest.delete(`/stories/delete/${image.storyId}`);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  const addSubmitHandler = async (e) => {
    e.preventDefault();
    let storyImg = "";
    if (storyPic) {
      storyImg = await upload();
      mutation.mutate({
        image: storyImg,
        isPost: true,
      });
    } else {
      return;
    }
    setIsOpen(false);
  };

  const deleteStoryHandler = async (storyId) => {
    mutation.mutate({
      storyId: storyId,
      isPost: false,
    });
  };

  /*============== GET OF LOGGED-IN USER STORIES ==================== */

  const {
    isLoading,
    error,
    data: stories,
  } = useQuery("stories", async () => {
    if (isLoginUser) {
      const res = await makeRequest.get(`/stories/find/${user.id}`);
      return res.data;
    }
  });

  //   console.log(stories);

  return (
    <div className="storiesModel">
      <div className="close">
        <button onClick={() => setIsOpen(false)}>X</button>
      </div>
      <div>
        <h1>ADD A STORY</h1>
      </div>
      <form className="updateForm" onSubmit={addSubmitHandler}>
        <div className="inputBlock">
          <label htmlFor="coverPic">Select Story Pic</label>
          <input
            type="file"
            id="coverPic"
            onChange={(e) => setStoryPic(e.target.files[0])}
            required
          />
        </div>
        <div className="btnBlock">
          <button type="submit">UPDATE</button>
        </div>
      </form>
      <h1 className="storiesHeading">YOUR ADDED STORIES</h1>

      {isLoading ? (
        <h1 className="loading">Loading...</h1>
      ) : stories.length > 0 ? (
        <div className="modalStories">
          {stories?.map((story) => (
            <div className="modalStory" key={story.id}>
              <button
                className="storyDeleteBtn"
                onClick={() => deleteStoryHandler(story.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#222"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>

              <img
                onClick={changeImageFit}
                style={{ objectFit: `${isCover ? "cover" : "contain"}` }}
                src={`http://localhost:3000/uploads/${story.image}`}
                alt="stories images"
              />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "gray", fontSize: "18px" }}>
          No Stories Added Yet! Add stories
        </p>
      )}
    </div>
  );
};

export default StoriesModel;
