import React from 'react'
import {Link} from 'react-router-dom'
import { AiOutlineHome } from 'react-icons/ai';
import { ImMap2 } from 'react-icons/im';
import { BiUserCircle } from "react-icons/bi";
import { BsJournalBookmark } from 'react-icons/bs';
import { VscSignIn } from 'react-icons/vsc';
import './NavBar.css';

function NavBar(){
    return(
        <nav className="nav">
            <div className="logo">
            <Link to="/map">SDGMap</Link>
            </div>
            <div className="container">
                <div className="main_list" id="mainListDiv">
                <ul>
                    <li><Link to="/map"><ImMap2 size={20} /> Map</Link></li>
                    <li><Link to="/sdgbook"><BsJournalBookmark size={18} /> SDGBook</Link></li>
                    <li><Link to="/"><AiOutlineHome size={20} /> Store</Link></li>
                    <li><Link to="/signin"><VscSignIn size={20} /> SignIn</Link></li>
                    <li><Link to="/user"><BiUserCircle size={20} /></Link></li>
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;