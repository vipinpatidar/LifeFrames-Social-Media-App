import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../utils/axios";

//CSS
import "./update.scss";
import { AuthContext } from "../../context/authContext";
const UpdateModel = ({ setIsOpen, user }) => {
  const [inputs, setInputs] = useState({
    name: "",
    city: "",
    website: "",
  });
  const [profilePic, setProfilePic] = useState(null);

  const [coverPic, setCoverPic] = useState(null);

  const queryClient = useQueryClient();

  const { updatedUser } = useContext(AuthContext);

  // console.log(user);

  //Upload image
  const upload = async (image) => {
    try {
      const formData = new FormData();
      formData.append("postImg", image);

      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  //React query Mutation
  const mutation = useMutation(
    (updatedUser) => {
      return makeRequest.put("/users/update", updatedUser);
    },
    {
      onSuccess: () => {
        //Invalidate and refetch posts data or trigger posts for adding new posts
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const updateSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let profileUrl = user?.profilePic;
      let coverUrl = user?.coverPic;
      let name = user?.name;
      let city = user?.city;
      let website = user?.website;

      if (profilePic) profileUrl = await upload(profilePic);
      if (coverPic) coverUrl = await upload(coverPic);
      if (inputs.name) name = inputs.name;
      if (inputs.city) city = inputs.city;
      if (inputs.website) website = inputs.website;

      // console.log(profileUrl);

      mutation.mutate({
        name: name,
        city: city,
        website: website,
        profilePic: profileUrl,
        coverPic: coverUrl,
      });

      updatedUser();

      setInputs({
        name: "",
        city: "",
        website: "",
      });
      setCoverPic(null);
      setProfilePic(null);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="updateModel">
      <div className="close">
        <button onClick={() => setIsOpen(false)}>X</button>
      </div>
      <div>
        <h1>UPDATE YOUR PROFILE</h1>
      </div>
      <form className="updateForm" onSubmit={updateSubmitHandler}>
        <div className="inputBlock">
          <label htmlFor="coverPic">Cover Pic</label>
          <input
            type="file"
            id="coverPic"
            onChange={(e) => setCoverPic(e.target.files[0])}
          />
        </div>
        <div className="inputBlock">
          <label htmlFor="profilePic">Profile Pic</label>
          <input
            type="file"
            id="profilePic"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </div>
        <div className="inputBlock">
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            name="name"
            placeholder="Your name..."
            value={inputs.name}
            onChange={inputChangeHandler}
          />
        </div>
        <div className="inputBlock">
          <label htmlFor="location">Your location</label>
          <input
            type="text"
            name="city"
            placeholder="Your location..."
            value={inputs.city}
            onChange={inputChangeHandler}
          />
        </div>
        <div className="inputBlock">
          <label htmlFor="website">Your website</label>
          <input
            type="text"
            name="website"
            placeholder="Your website..."
            value={inputs.website}
            onChange={inputChangeHandler}
          />
        </div>
        <div className="btnBlock">
          <button type="submit">UPDATE</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateModel;
