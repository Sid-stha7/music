import React from "react";
import "./login.css"; // We will create this next
import { redirectToAuthCodeFlow } from "../config/spotifyAuth"; // Make sure path is correct
import brainbeatsLogo from "../assets/white_brain_beats.png";
function Login() {
    return (
        <div className="login-container">
            {/* The Animated Background */}
            <div className="background-animation">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
                <div className="line line-4"></div>
                <div className="line line-5"></div>
            </div>

            {/* The Login Content */}
            <div className="login-content">
                <img
        src={brainbeatsLogo} 
        alt="BrainBeats Logo"
        className="login-logo"
    />
                
                <h1 className="login-title">Brain Beats</h1>
                
                <button onClick={redirectToAuthCodeFlow} className="login-btn">
                    LOG IN WITH SPOTIFY
                </button>
            </div>
        </div>
    );
}

export default Login;