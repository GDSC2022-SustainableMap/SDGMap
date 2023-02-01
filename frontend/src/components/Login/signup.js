import React from 'react';
import { Link } from "react-router-dom";
import './login.css';

function Signup(){
    return(
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
                            <span className="link-primary">
                            <Link to="/login" className="login-link">Sign In</Link>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;