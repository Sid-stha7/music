import React, { useEffect, useState, useRef } from 'react';
import { getAccessToken, redirectToAuthCodeFlow } from "./config/spotifyAuth";
// 1. Import fetchPlaylists 👇
import { fetchProfile, fetchTopArtists, fetchNowPlaying, fetchPlaylists } from "./config/spotify";

function App() {
    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [nowPlaying, setNowPlaying] = useState(null);
    // 2. Add Playlist State 👇
    const [playlists, setPlaylists] = useState(null);

    const effectRan = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code && !token && effectRan.current === false) {
            effectRan.current = true;

            getAccessToken(code).then(async (accessToken) => {
                if (!accessToken) return;
                
                setToken(accessToken);
                window.history.replaceState({}, document.title, "/");

                // Fetch all data
                const profileData = await fetchProfile(accessToken);
                setProfile(profileData);

                const artistsData = await fetchTopArtists(accessToken);
                setTopArtists(artistsData.items);

                const playingData = await fetchNowPlaying(accessToken);
                setNowPlaying(playingData);

                // 3. Fetch Playlists 👇
                const playlistData = await fetchPlaylists(accessToken);
                setPlaylists(playlistData.items);
            });
        }
    }, [token]);

    if (!token) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1DB954' }}>
                <button onClick={redirectToAuthCodeFlow} style={{ padding: '20px', fontSize: '20px', borderRadius: '50px', border: 'none', cursor: 'pointer' }}>
                    Login with Spotify
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', fontFamily: 'sans-serif', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
            
            {/* 4. NEW: Sidebar for Playlists */}
            <div style={{ width: '250px', backgroundColor: '#000', padding: '20px', flexShrink: 0 }}>
                <h3 style={{ marginBottom: '20px', color: '#b3b3b3' }}>Your Library</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {playlists ? playlists.map(playlist => (
                        <li key={playlist.id} style={{ marginBottom: '15px', cursor: 'pointer', opacity: 0.8, fontSize: '14px' }}>
                            {playlist.name}
                        </li>
                    )) : <p>Loading...</p>}
                </ul>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '20px' }}>
                
                {/* Header */}
                {profile && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                        {profile.images?.length > 0 && <img src={profile.images[0].url} alt="Profile" style={{ width: 60, height: 60, borderRadius: '50%', marginRight: '20px' }} />}
                        <h1>{profile.display_name}</h1>
                    </div>
                )}

                {/* Now Playing */}
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

                {/* Top Artists */}
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
        </div>
    );
}

export default App;