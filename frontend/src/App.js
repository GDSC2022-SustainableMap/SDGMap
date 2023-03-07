import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home";
import NavBar from "./components/Navbar/NavBar";
import Map from "./components/Map/map";
import User from "./components/User/user";
import Login from "./components/Login/login";
import Book from "./components/Book/book";
import PasswordReset from "./components/Login/password_reset";
import Community from "./components/Community/community";
import Signup from "./components/Login/signup";
import useToken from "./hooks/token";
function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="App">
      <NavBar token={token} removeToken={removeToken}/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/map" element={<Map />} />
        <Route exact path="/sdgbook" element={<Book />} />
        <Route exact path="/user" element={<User token={token}/>} />
        <Route exact path="/signin" element={<Login setToken={setToken} token={token}/>} />
        <Route exact path="/community" element={<Community />} />
        <Route exact path="/password_reset" element={<PasswordReset />} />
        <Route exact path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
