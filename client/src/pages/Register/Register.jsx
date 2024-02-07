import React, { useState } from "react";
import axios from "axios";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;

    setInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      // console.log(inputs);

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        inputs
      );

      // console.log(response);

      setInputs({
        username: "",
        email: "",
        password: "",
        name: "",
      });

      setError(null);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response.data.error;
      setError(errorMessage);
    }
  };

  return (
    <div className="register_page">
      <div className="register">
        <div className="card">
          <div className="right">
            <h1>Create an account</h1>
            <form onSubmit={submitHandler}>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name..."
                value={inputs.name}
                onChange={inputChangeHandler}
              />
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter Your Username..."
                value={inputs.username}
                onChange={inputChangeHandler}
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email..."
                value={inputs.email}
                onChange={inputChangeHandler}
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Your Password..."
                value={inputs.password}
                onChange={inputChangeHandler}
              />

              {error && <p className="error">{error}</p>}

              <button type="submit">Register</button>
            </form>
          </div>
          <div className="left">
            <h1>Life Frame</h1>
            <p>
              Welcome to the social world of LifeFrame, where your moments come
              to life. Connect, share, and explore with friends. Capture
              memories, and be part of the LifeFrame community. Your journey
              begins here!
            </p>
            <span>Already have an account?</span>
            <Link className="button" to={"/login"}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
