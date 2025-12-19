import React, { useEffect, useState, useRef } from 'react';
import { getAccessToken, redirectToAuthCodeFlow } from "./config/spotifyAuth";

import { fetchProfile, fetchTopArtists, fetchNowPlaying, fetchPlaylists, fetchTracks } from "./config/spotify";

function App() {
    
    
    //const [token, setToken] = useState(null);
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const [profile, setProfile] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [playlists, setPlaylists] = useState(null);

    const [tracks, setTracks] = useState(null);
    const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);

    const effectRan = useRef(false);

    
    // Effect 1: Handle the Login (Trade Code for Token)
useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !token && effectRan.current === false) {
        effectRan.current = true;
        getAccessToken(code).then(accessToken => {
            if (!accessToken) return;
            window.localStorage.setItem("token", accessToken);
            setToken(accessToken);
            window.history.replaceState({}, document.title, "/");
        });
    }
}, [token]);

   // Effect 2: Fetch Data (Runs whenever 'token' exists)
useEffect(() => {
    if (!token) return; // If no token, do nothing

    async function fetchData() {
        const profileData = await fetchProfile(token);
        setProfile(profileData);

        const playlistsData = await fetchPlaylists(token);
        setPlaylists(playlistsData.items);

        // NOTE: We still need to fix the `$` bug in fetchTopArtists later!
        const artistsData = await fetchTopArtists(token); 
        setTopArtists(artistsData.items);
        
        const playingData = await fetchNowPlaying(token);
        setNowPlaying(playingData);
    }

    fetchData();
}, [token]);

    //  the click handler 
    const selectPlaylist = async (id, name) => {
        const tracksData = await fetchTracks(token, id);
        setTracks(tracksData.items);
        setSelectedPlaylistName(name);
    };

    // Go Back Handler (to clear tracks and show artists again)
    const renderHome = () => {
        setTracks(null);
        setSelectedPlaylistName(null);
    };

    if (!token) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1DB954' }}><button onClick={redirectToAuthCodeFlow}>Login</button></div>;

    return (
        <div style={{ display: 'flex', fontFamily: 'sans-serif', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
            
            {/* Sidebar */}
            <div style={{ width: '250px', backgroundColor: '#000', padding: '20px', flexShrink: 0 }}>
                <div onClick={renderHome} style={{ cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold', fontSize: '24px' }}>🏠 Home</div>
                <h3 style={{ marginBottom: '20px', color: '#b3b3b3' }}>Your Library</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {playlists ? playlists.map(playlist => (
                        <li 
                            key={playlist.id} 
                            //  attach click handler 
                            onClick={() => selectPlaylist(playlist.id, playlist.name)}
                            style={{ marginBottom: '15px', cursor: 'pointer', opacity: 0.8, fontSize: '14px' }}
                        >
                            {playlist.name}
                        </li>
                    )) : <p>Loading...</p>}
                </ul>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                
                {/* Header */}
                {profile && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                        {profile.images?.length > 0 && <img src={profile.images[0].url} alt="Profile" style={{ width: 60, height: 60, borderRadius: '50%', marginRight: '20px' }} />}
                        <h1>{profile.display_name}</h1>
                    </div>
                )}

                {/*  CONDITIONAL RENDERING: If tracks exist, show them. Else show Top Artists. 👇 */}
                {tracks ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <button onClick={renderHome} style={{ marginRight: '20px', background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>←</button>
                            <h2 style={{ margin: 0 }}>{selectedPlaylistName}</h2>
                        </div>
                        
                        {/* Track List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {tracks.map((item, index) => (
                                <div key={item.track.id + index} style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#181818', borderRadius: '5px' }}>
                                    <span style={{ width: '30px', color: '#b3b3b3' }}>{index + 1}</span>
                                    {item.track.album.images.length > 0 && <img src={item.track.album.images[0].url} style={{ width: '40px', height: '40px', marginRight: '15px' }} alt="Art" />}
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.track.name}</div>
                                        <div style={{ fontSize: '14px', color: '#b3b3b3' }}>{item.track.artists.map(a => a.name).join(', ')}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: '#b3b3b3', fontSize: '14px' }}>
                                        {/* Convert ms to minutes:seconds */}
                                        {Math.floor(item.track.duration_ms / 60000)}:
                                        {((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Default View: Top Artists */
                    <div>
                         {/* Now Playing Widget */}
                        {nowPlaying && nowPlaying.item && (
                            <div style={{ backgroundColor: '#282828', padding: '20px', borderRadius: '10px', marginBottom: '40px', maxWidth: '400px' }}>
                                <h2 style={{ marginTop: 0, fontSize: '16px', color: '#1DB954' }}>NOW PLAYING</h2>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {nowPlaying.item.album?.images[0]?.url && (
                                        <img src={nowPlaying.item.album.images[0].url} alt="Album Art" style={{ width: '60px', height: '60px', borderRadius: '5px', marginRight: '15px' }} />
                                    )}
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{nowPlaying.item.name}</h3>
                                        <p style={{ margin: 0, color: '#b3b3b3', fontSize: '14px' }}>{nowPlaying.item.artists[0].name}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <h2>Your Top Artists</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                            {topArtists && topArtists.map(artist => (
                                <div key={artist.id} style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                                    {artist.images.length > 0 && <img src={artist.images[0].url} alt={artist.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />}
                                    <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{artist.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;