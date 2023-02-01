import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import Psd_reset from './password_reset';
import './login.css';

export default function (props) {
    let [authMode, setAuthMode] = useState("signin")
    const changeAuthMode = () => { setAuthMode(authMode === "signin" ? "signup" : "signin") }

    if (authMode === "signin") {
        return (
            <div className="login-container">
                <form className="login-form">
                    <div className="form-content">
                        <h3 className="form-title">Sign In</h3>
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
                            <button type="submit" className="btn">
                                Submit
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            Not registered yet?{" "}
                            <span className="link" onClick={changeAuthMode}>
                                Sign Up
                            </span>
                        </div>
                        
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="login-container">
            <form className="login-form">
                <div className="form-content">
                    <h3 className="form-title">Sign Up</h3>
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
                        <input
                            type="text"
                            className="form-control mt-1"
                            placeholder=""
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn">
                            Submit
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        Already registered?{" "}
                        <span className="link" onClick={changeAuthMode}>
                            Sign In
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}