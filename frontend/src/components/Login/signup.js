import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import locale from "antd/locale/zh_TW";
import { DatePicker } from "antd";
function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState();
  const [region, setRegion] = useState("");

  let rawResponse;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/user/register", {
          userName: userName,
          email: email,
          password: password,
          birthday: birthday
        })
      ).data;
      alert("Resgister successfully! Jumping to sign in page.");
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
    return rawResponse;
  };

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
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label className="login-label">Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3 text-left">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {/* <a href="/password_reset">Forgot password?</a> */}
            </div>
            <div
              className="form-group mt-3"
              style={{ borderColor: "#379878e7" }}
            >
              <label className="login-label">Birth</label>

              <DatePicker
                onChange={(_,dateString) => {
                  setBirthday(dateString);
                  // console.log(date,dateString);
                }}
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                locale={locale}
              />
            </div>
            {/* <DatePicker locale={locale} /> */}
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            <div className="text-center mt-2">
              Already registered?{" "}
              <span className="link-primary">
                <Link to="/signin" className="login-link">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
