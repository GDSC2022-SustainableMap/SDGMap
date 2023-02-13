import React from 'react';

function PasswordReset(){
    return(
        <div>
            <div className="login-container">
                <form className="login-form">
                <div className="form-content">
                    <h3 className="title">Reset your password</h3>
                    <div className="form-group mt-3">
                    <label className="login-label" for='email'>Enter your user account's email address and we will send you a password reset link.</label>
                    <input
                        type="email"
                        className="form-control mt-1"
                        placeholder="Email Address"
                        id="email"
                    />
                    </div>
                    
                    <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn" >
                        Send password reset email
                    </button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default PasswordReset;