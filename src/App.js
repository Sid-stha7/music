// import logo from './logo.svg';
// import './App.css';
// import Player from "./component/Player";
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//           <Player />
//       </header>
//     </div>
//   );
// }
//
// export default App;


import React, { useEffect, useState } from 'react';
import {getAccessToken, redirectToAuthCodeFlow} from "./config/spotifyAuth";


// TODO: Replace with your actual Client ID from the Spotify Dashboard
const clientId = "YOUR_ACTUAL_CLIENT_ID_HERE";

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check if there is a code in the URL (user just logged in)
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code && !token) {
            // If we have a code, trade it for a token
            getAccessToken(clientId, code).then(accessToken => {
                setToken(accessToken);
                // Optional: Clean up URL
                window.history.replaceState({}, document.title, "/");
            });
        }
    }, [token]);

    if (!token) {
        return (
            <div className="App">
                <h1>Spotify Dashboard</h1>
                <button onClick={() => redirectToAuthCodeFlow(clientId)}>
                    Login with Spotify
                </button>
            </div>
        );
    }

    return (
        <div className="App">
            <h1>Logged In! 🚀</h1>
            <p>Your Access Token: {token.substring(0, 15)}...</p>
            {/* We will build the Dashboard components here next */}
        </div>
    );
}

export default App;