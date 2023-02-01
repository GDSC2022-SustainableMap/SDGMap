import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import Psd_reset from './password_reset';
import './login.css';

export default function (props) {
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
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label className="login-label">Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder=""
                        />
                        {/* <button type="button" class="btn btn-link"><Link to="/password_reset">Forgot password?</Link></button>
                        <Routes>
                            <Route exact path="/password_reset" element={<Psd_reset/>} />
                        </Routes> */}
                        <a href="./password_reset">Forgot password?</a>
                    </div>
                    <div className="d-grid  mt-3">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        Not registered yet?{" "}
                        <span className="link-primary">
                        <Link to="/signup">Sign Up</Link>
                        </span>
                    </div>
                    
                </div>
            </form>
        </div>
    )
}