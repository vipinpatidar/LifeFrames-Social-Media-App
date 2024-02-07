import React, { useContext, useState, useEffect } from "react";

//Icons
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/Posts/Posts";

//React query
import { useQuery, useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../utils/axios";
//CSS
import "./profile.scss";
import { AuthContext } from "../../context/authContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UpdateModel from "../../components/UpdateModel/UpdateModel";
import { colors } from "@mui/material";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user: loggedInUser, isLoginUser } = useContext(AuthContext);

  const { userId: openProfileId } = useParams();

  const navigate = useNavigate();

  // console.log(openProfileId);

  const queryClient = useQueryClient();

  /*============= GET USER INFO ================*/

  const {
    isLoading,
    error,
    data: user,
  } = useQuery(["user", { openProfileId }], async () => {
    if (isLoginUser) {
      const res = await makeRequest.get(`/users/find/${openProfileId}`);
      return res.data;
    }
  });

  /*============= GET FOLLOW / UNFOLLOW  ================*/

  const { isLoading: isRelationLoading, data: relationsData } = useQuery(
    "relationships",
    async () => {
      const res = await makeRequest.get(
        `/relations/get?followedUserId=${openProfileId}`
      );
      return res.data;
    }
  );

  // console.log(relationsData);

  /*
  
  sending userId for that user which a logged in user opened as followedUserId 

  in backend we check that that who follows that opened profile and send as a array of followerUserId 

  than we check that logged in user is in that array or not relationData.includes(loggedInUser.id) 
  
  */

  /*============= POST / DELETE FOLLOW / UNFOLLOW  ================*/

  const mutation = useMutation(
    (isFollowed) => {
      if (isFollowed) {
        return makeRequest.delete(
          `/relations/remove?followedUserId=${openProfileId}`
        );
      } else {
        return makeRequest.post(`/relations/add`, {
          followedUserId: openProfileId,
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationships"]);
      },
    }
  );

  const followUnfollow = (userId) => {
    mutation.mutate(relationsData.includes(loggedInUser.id));
  };

  /*============= OPEN / CLOSE UPDATE MODEL  ================*/

  const openCloseModel = () => {
    setIsOpen((prevState) => !prevState);
  };

  if (isLoading) {
    return <h1 className="loading">Loading...</h1>;
  }

  if (error?.response?.status === 401) {
    navigate("/login");
  }

  if (error) {
    return (
      <h1
        className="error"
        style={{ textAlign: "center", marginTop: "5rem", fontSize: "16px" }}
      >
        OOPS! Something went wrong.
      </h1>
    );
  }

  return (
    <div className="profile">
      {isOpen && <UpdateModel setIsOpen={setIsOpen} user={user} />}
      <div className="images">
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/uploads/${user?.coverPic}`}
          alt=""
          className="cover"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
              user?.profilePic
            }`}
            alt=""
            className="profilePic"
          />

          <div className="center">
            <span>{user?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{user?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{user?.website}</span>
              </div>
            </div>
            {loggedInUser.id === user?.id ? (
              <button onClick={openCloseModel}>Update</button>
            ) : (
              <button onClick={followUnfollow}>
                {relationsData?.includes(loggedInUser.id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="medium" />
            </a>
          </div>
        </div>
        <Posts openProfileId={openProfileId} />
      </div>
    </div>
  );
};

export default Profile;
