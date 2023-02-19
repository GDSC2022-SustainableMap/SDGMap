import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./login.css";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
// import Psd_reset from "./password_reset";

export default function Login (props) {
  let [authMode, setAuthMode] = useState("signin");
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed" + error),
  });
  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const LogOut = () => {
    googleLogout();
    setProfile(null);
  };

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

  if (authMode === "signin") {
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
              {/* <button type="button" class="btn btn-link"><Link to="/password_reset">Forgot password?</Link></button>
                        <Routes>
                            <Route exact path="/password_reset" element={<Psd_reset/>} />
                        </Routes> */}
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
              <span className="login-link" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
          </div>
        </form>
        <hr />
        {profile ? (
          <div>
            <img src={profile.picture} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {profile.name}</p>
            <p>Email Address: {profile.email}</p>
            <button id="logout-btn" onClick={LogOut}>
              Log out
            </button>
          </div>
        ) : (
          <button id="google-btn" onClick={() => login()}>
            <FcGoogle size={20} /> Sign in with Google
          </button>
        )}
      </div>
    );
  }
  return (
    <div>
      <div className="login-container">
        <form className="login-form">
          <div className="form-content">
            <h3 className="title">Sign Up</h3>
            <div className="form-group mt-3">
              <label className="login-label">Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Username"
              />
            </div>
            <div className="form-group mt-3">
              <label className="login-label">Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group mt-3 text-left">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
              />
              {/* <a href="/password_reset">Forgot password?</a> */}
            </div>
            <div className="form-group mt-3">
              <label className="login-label">Birth</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="YYYY/MM/DD"
              />
            </div>
            <div className="form-group mt-3">
              <label className="login-label">Region</label>
              <input type="text" className="form-control mt-1" placeholder="" />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
            <div className="text-center mt-2">
              Already registered?{" "}
              <span className="login-link" onClick={changeAuthMode}>
                Sign In
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
