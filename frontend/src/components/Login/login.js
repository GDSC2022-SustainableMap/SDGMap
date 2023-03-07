import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Link, Navigate  } from "react-router-dom";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  let rawResponse;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    rawResponse = await axios
      .post("http://127.0.0.1:5000/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        props.setToken(response.data.access_token);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    alert("Login successfully! Jumping to main page.");
    navigate("/");

    return rawResponse;
  };

  return props.token ? (
    <Navigate to="/" />
  ) : (
    <div className="login-container">
      <form className="login-form">
        <div className="form-content">
          <h3 className="title">Sign In</h3>
          <div className="form-group mt-3">
            <label className="login-label">Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder=""
              onChange={(e) => setpassword(e.target.value)}
            />
            <Link to="/password_reset">Forgot password?</Link>
            <a href="./password_reset">Forgot password?</a>
          </div>
          <div className="d-grid  mt-3">
            <button type="submit" className="btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div className="text-center mt-2">
            Not registered yet?{" "}
            <Link to="/signup">
              <span className="login-link">Sign Up</span>
            </Link>
          </div>
        </div>
      </form>
      <hr />
    </div>
  );
}
