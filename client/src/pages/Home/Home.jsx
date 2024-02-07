import React from "react";
import "./home.scss";
import Stories from "../../components/Stories/Stories";
import Posts from "../../components/Posts/Posts";
import Share from "../../components/Share/Share";
import OtherUsers from "../../components/OtherUsers/OtherUsers";

const Home = () => {
  return (
    <div className="home">
      <Stories />
      <OtherUsers />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
