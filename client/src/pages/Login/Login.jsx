import React, { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useMutation } from "react-query";
import { makeRequest } from "../../utils/axios";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [forgetInputs, setForgetInputs] = useState({
    email: "",
    password: "",
  });

  const [isForgetPassword, setIsForgetPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const forgetInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setForgetInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitLoginHandler = async (e) => {
    try {
      e.preventDefault();
      await login(inputs);

      setInputs({
        username: "",
        password: "",
      });
      setError(null);

      navigate("/");
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  /*============== Change password ================ */
  const mutation = useMutation(
    (data) => {
      return makeRequest.put("/auth/changePassword", data);
    },
    {
      onSuccess: () => {
        navigate("/");
        setIsForgetPassword(false);
      },
    }
  );

  const submitUpdatePasswordHandler = () => {
    mutation.mutate({
      email: forgetInputs.email,
      password: forgetInputs.password,
    });
  };

  return (
    <div className="login_page">
      <div className="login">
        <div className="card">
          <div className="left">
            <h1>Hello World</h1>
            <p>
              Welcome to the social world of LifeFrame, where your moments come
              to life. Connect, share, and explore with friends. Capture
              memories, and be part of the LifeFrame community. Your journey
              begins here!
            </p>
            <span>Don't you have an account?</span>
            <Link className="button" to={"/register"}>
              Register
            </Link>
          </div>
          {!isForgetPassword ? (
            <div className="right">
              <h1>Login</h1>
              <form onSubmit={submitLoginHandler}>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter Your Username..."
                  value={inputs.username}
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
                <button type="submit">Login</button>
                <div
                  onClick={() => setIsForgetPassword(true)}
                  className="forgetPass"
                >
                  Forget Password?
                </div>
                <div
                  className="guestUser"
                  onClick={() =>
                    setInputs({
                      username: "guest47",
                      password: "vipin123",
                    })
                  }
                >
                  Login As Guest User?
                </div>
              </form>
            </div>
          ) : (
            <div className="right">
              <h1>Update Password</h1>
              <form onSubmit={submitUpdatePasswordHandler}>
                <input
                  type="email"
                  name="email"
                  id="username"
                  placeholder="Enter Your email..."
                  value={forgetInputs.email}
                  onChange={forgetInputChangeHandler}
                />
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Your New Password..."
                  value={forgetInputs.password}
                  onChange={forgetInputChangeHandler}
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Update</button>
                <div
                  onClick={() => setIsForgetPassword(false)}
                  className="forgetPass"
                >
                  Want to login?
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
