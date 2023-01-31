import React from 'react'
import {Link} from 'react-router-dom'

function NavBar(){
    return(
        <div align="right">
            <button type="button" class="btn btn-link"><Link to="/">Home</Link></button>
            <button type="button" class="btn btn-link"><Link to="/about">About</Link></button>
            <button type="button" class="btn btn-link"><Link to="/projects">Projects</Link></button>
        </div>
    );
}

export default NavBar;