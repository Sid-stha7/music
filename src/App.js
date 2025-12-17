import React, { useEffect, useState, useRef } from 'react'; // 1. Import useRef
import { getAccessToken, redirectToAuthCodeFlow } from "./config/spotifyAuth";
import { fetchProfile, fetchTopArtists, fetchNowPlaying } from "./config/spotify";

function App() {
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [timeRange, setTimeRange] = useState("medium_term");

    //  Create a ref to track if code has been used
    const effectRan = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        //  Add the check: Only run if we haven't run before
        if (code && !token && effectRan.current === false) {
            
            // Mark as run immediately so the second attempt is blocked
            effectRan.current = true;

            getAccessToken(code).then(async (accessToken) => {
                //  Safety Check: Ensure we actually got a token before using it
                if (!accessToken) {
                    console.error("Login failed or code already used.");
                    return;
                }

                console.log("Token:", accessToken);
                setToken(accessToken);
                window.history.replaceState({}, document.title, "/");

                // Fetch data safely
                const profileData = await fetchProfile(accessToken);
                setProfile(profileData);

            
                const playingData = await fetchNowPlaying(accessToken);
                setNowPlaying(playingData);
            });
        }
    }, [token]);


    useEffect(() => {
    if (token) {
        fetchTopArtists(token, timeRange).then((data) => {
             // Check if data exists before setting
             if (data && data.items) {
                 setTopArtists(data.items);
             }
        });
    }
}, [token, timeRange]); // This dependency array is KEY. It runs whenever token or timeRange changes.

    if (!token) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1DB954' }}>
                <button 
                    onClick={redirectToAuthCodeFlow}
                    style={{ padding: '20px', fontSize: '20px', borderRadius: '50px', border: 'none', cursor: 'pointer' }}
                >
                    Login with Spotify
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
            {/* Header Section */}
            {profile && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                    {profile.images?.length > 0 && <img src={profile.images[0].url} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', marginRight: '20px' }} />}
                    <h1>{profile.display_name}</h1>
                </div>
            )}

            {/* Now Playing Section */}
            {nowPlaying && nowPlaying.item ? (
                <div style={{ backgroundColor: '#282828', padding: '20px', borderRadius: '10px', marginBottom: '40px', maxWidth: '400px' }}>
                    <h2 style={{ marginTop: 0 }}>Now Playing 🎵</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* 5. Add Optional Chaining (?) here to prevent crashes on podcasts */}
                        {nowPlaying.item.album?.images[0]?.url && (
                             <img 
                                src={nowPlaying.item.album.images[0].url} 
                                alt="Album Art" 
                                style={{ width: '80px', height: '80px', borderRadius: '5px', marginRight: '15px' }} 
                            />
                        )}
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{nowPlaying.item.name}</h3>
                            <p style={{ margin: 0, color: '#b3b3b3' }}>{nowPlaying.item.artists[0].name}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ marginBottom: '40px' }}>
                    <h2>Now Playing 🎵</h2>
                    <p style={{ color: '#b3b3b3' }}>Not playing anything right now.</p>
                </div>
            )}


    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Your Top Artists</h2>
    
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setTimeRange("short_term")} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: timeRange === "short_term" ? '#1DB954' : '#333', color: 'white' }}>
                Last Month
            </button>
            <button onClick={() => setTimeRange("medium_term")} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: timeRange === "medium_term" ? '#1DB954' : '#333', color: 'white' }}>
                6 Months
            </button>
            <button onClick={() => setTimeRange("long_term")} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: timeRange === "long_term" ? '#1DB954' : '#333', color: 'white' }}>
                All Time
            </button>
        </div>
    </div>
   
        </div>
           
    );
}

export default App;