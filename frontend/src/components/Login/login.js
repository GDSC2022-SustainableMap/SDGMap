import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Psd_reset from "./password_reset";
import "./login.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  let rawResponse;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    rawResponse = (
      await axios.post("http://127.0.0.1:5000/login", {
        email: email,
        password: password,
      })
    ).data;

    alert("Login successfully! Jumping to main page.");
    navigate("/");

    return rawResponse;
  };

  return (
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
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder=""
              id="password"
              onChange={(e) => setpassword(e.target.value)}
            />
            {/* <button type="button" class="btn btn-link"><Link to="/password_reset">Forgot password?</Link></button>
                        <Routes>
                            <Route exact path="/password_reset" element={<Psd_reset/>} />
                        </Routes> */}
            <a href="./password_reset">Forgot password?</a>
          </div>
          <div className="d-grid  mt-3">
            <button type="submit" className="btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div className="text-center mt-2">
            Not registered yet?{" "}
            <span className="link-primary">
              <Link to="/signup" className="login-link">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
