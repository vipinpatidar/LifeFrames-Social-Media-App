import { useContext, useState } from "react";
import Image from "../../assets/img.png";
// import Map from "../../assets/map.png";
// import Friend from "../../assets/friend.png";
import { AuthContext } from "../../context/authContext";
//CSS
import "./share.scss";
//Axios
import { makeRequest } from "../../utils/axios.js";
//React Query
import { useMutation, useQueryClient } from "react-query";

const Share = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const { user } = useContext(AuthContext);
  // Access the client
  const queryClient = useQueryClient();

  const inputChangeHandler = (e) => {
    setDescription(e.target.value);
  };

  //Upload image
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("postImg", image);

      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  //React query Mutation
  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("posts/add", newPost);
    },
    {
      onSuccess: () => {
        //Invalidate and refetch posts data or trigger posts for adding new posts
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const addPostHandler = async (e) => {
    e.preventDefault();
    let imgUrl = "";

    if (image) imgUrl = await upload();

    mutation.mutate({
      description: description,
      image: imgUrl,
    });

    setDescription("");
    setImage(null);
  };

  return (
    <div className="share">
      <form encType="multipart/form-data" className="container">
        <div className="top">
          <div className="left">
            <img
              src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                user.profilePic
              }`}
              alt=""
            />
            <input
              type="text"
              placeholder={`What's on your mind ${user.name}?`}
              value={description}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="right">
            {image && (
              <img
                className="file"
                src={URL.createObjectURL(image)}
                alt="file"
              />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            {/* <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div> */}
          </div>
          <div className="right">
            <button type="submit" onClick={addPostHandler}>
              Share
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Share;
