import React, { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import StoriesModel from "../StoriesModel/StoriesModel";
import { useQuery } from "react-query";
import { makeRequest } from "../../utils/axios";

const Stories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoginUser } = useContext(AuthContext);

  const closeOpenModelHandler = () => {
    setIsOpen((prevState) => !prevState);
  };

  /*============== GET OF LOGGED-IN USER STORIES ==================== */

  const {
    isLoading,
    error,
    data: stories,
  } = useQuery("storiesAll", async () => {
    if (isLoginUser) {
      const res = await makeRequest.get(`/stories/get`);
      return res.data;
    }
  });

  const onlyFollowedStory = stories?.filter(
    (story) => story.userId !== user.id
  );

  // console.log(onlyFollowedStory);

  const isLoggedInStories = stories
    ?.map((story) => story.userId)
    ?.includes(user.id);

  // console.log(isLoggedInStories);

  return (
    <div className="stories">
      {isOpen && <StoriesModel setIsOpen={setIsOpen} />}
      <div
        className={`story loggedInStory ${isLoggedInStories && "showBorder"}`}
        onClick={closeOpenModelHandler}
      >
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/uploads/${user?.profilePic}`}
          alt="user"
        />
        <span>{user.name}</span>
        <button>+</button>
      </div>

      {isLoading ? (
        <h1 className="loading">Loading...</h1>
      ) : onlyFollowedStory?.length > 0 ? (
        onlyFollowedStory?.map((story) => (
          <div className="story" key={story.id}>
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${story.image}`}
              alt=""
            />
            <span>{story.name}</span>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "gray", fontSize: "18px" }}>
          No Stories!
        </p>
      )}
    </div>
  );
};

export default Stories;
