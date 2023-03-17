import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { ImMap2 } from "react-icons/im";
import { BiUserCircle } from "react-icons/bi";
import { BsJournalBookmark } from "react-icons/bs";
import { VscSignIn } from "react-icons/vsc";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import axios from "axios";
function NavBar(props) {
  let rawResponse;
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    rawResponse = await axios
      .get("http://127.0.0.1:5000/user/logout", {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    props.removeToken();
    alert("Logout successfully! Jumping to main page.");
    navigate("/");

    return rawResponse;
  };
  return (
    <nav className="nav-header">
      <div className="logo">
        <Link to="/map">SDGMap</Link>
      </div>
      <div className="container">
        <div className="main_list" id="mainListDiv">
          {props.token != null ? (
            <ul>
              <li>
                <Link to="/map">
                  <ImMap2 size={20} /> 地圖
                </Link>
              </li>
              <li>
                <Link to="/sdgbook">
                  <BsJournalBookmark size={18} /> 徽章圖鑑
                </Link>
              </li>
              <li>
                <Link to="/">
                  <AiOutlineHome size={20} /> 道具商店
                </Link>
              </li>
              <li onClick={handleLogout}>
                <Link to="/">
                  <VscSignIn size={20} /> 登出
                </Link>
              </li>
              <li>
                <Link to="/community">
                  <HiOutlineUserGroup size={20} /> 部落
                </Link>
              </li>
              <li>
                <Link to="/user">
                  <BiUserCircle size={20} />
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/sdgbook">
                  <BsJournalBookmark size={18} /> SDGBook
                </Link>
              </li>
              <li>
                <Link to="/map">
                  <ImMap2 size={20} /> 地圖
                </Link>
              </li>
              <li>
                <Link to="/signin">
                  <VscSignIn size={20} /> 登入
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
