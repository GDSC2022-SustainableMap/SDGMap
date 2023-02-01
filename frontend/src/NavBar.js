import React from 'react'
import {Link} from 'react-router-dom'
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import './NavBar.css';

function NavBar(){
    return(
        <nav className="nav">
            <div className="logo">
            <Link to="/">SDGMap</Link>
            </div>
            <div className="container">
                <div className="main_list" id="mainListDiv">
                <ul>
                    <li><Link to="/"><AiOutlineHome/>home</Link></li>
                    <li><Link to="/map">map</Link></li>
                    <li><Link to="/login">login</Link></li>
                    <li><Link to="/signup">signup</Link></li>
                    <li><Link to="/user"><AiOutlineUser/></Link></li>
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;