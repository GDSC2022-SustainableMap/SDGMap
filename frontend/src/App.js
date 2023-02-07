import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Home from './components/Home';
import Projects from './components/Projects';
import About from './components/About';
import NavBar from './components/Navbar/NavBar';
import Map from './components/Map/map';
import User from './components/User';
import Login from './components/Login/login';
import Signup from "./components/Login/signup";

function App() {
  
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/map" element={<Map />} />
        <Route exact path="/user" element={<User />} />
        <Route exact path="/signin" element={<Login/>} />
        <Route exact path="/signup" element={<Signup/>} />
      </Routes>
    </div>
  );
}

export default App;