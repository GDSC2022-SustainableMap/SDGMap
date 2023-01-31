import React from "react";
import "./App.css";
import Home from './components/Home';
import Projects from './components/Projects';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import NavBar from './NavBar';
import Map from './components/SimpleMap';
import User from './components/User';


function App() {
  return (
    <div className="App">
        <NavBar />
        <Routes>
            <Route exact path="/" element={<Map />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/projects" element={<Projects />} />
            <Route exact path="/user" element={<User />} />
        </Routes>
    </div>
  );
}

export default App;