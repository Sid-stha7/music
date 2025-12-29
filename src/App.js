import React, { useEffect, useState, useRef } from 'react';
import { getAccessToken, redirectToAuthCodeFlow } from "./config/spotifyAuth";
import { fetchProfile, fetchTopArtists, fetchNowPlaying, fetchPlaylists, fetchTracks } from "./config/spotify";
import ArtistView from './components/ArtistView';
import Player from './components/Player';

import Sidebar from './components/Sidebar'; 
import TrackList from './components/Tracklist';
import NowPlaying from "./components/nowPlaying"

import "./components/Player.css";
import Login from './components/login';

function App() {
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const [profile, setProfile] = useState(null);
    const [topArtists, setTopArtists] = useState(null);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [tracks, setTracks] = useState(null);
    const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [view, setView] = useState('home');
    const [globalCurrentTrack, setGlobalCurrentTrack] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const effectRan = useRef(false);

    const playTrack = async (id) => {
        try {
       // Default body: Play just one song
        let body = {
            uris: [id] 
        };
        // If we are viewing a playlist, play the whole thing!
        if (selectedPlaylistId) {
            body = {
                context_uri: `spotify:playlist:${selectedPlaylistId}`,
                offset: {
                    uri: id
                }
            };
        }

        if (!deviceId) {
            console.error("No Device ID found! Is the player ready?");
            return;
        }
           await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        } catch (error) {
            console.error("Error playing track:", error);
        }
    };

    //  Handle Login
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

    // Fetch Data
    useEffect(() => {
        if (!token) return;

        async function fetchData() {
            const profileData = await fetchProfile(token);
            setProfile(profileData);

            const playlistsData = await fetchPlaylists(token);
            setPlaylists(playlistsData.items);

            const artistsData = await fetchTopArtists(token); 
            setTopArtists(artistsData.items);
            
            const playingData = await fetchNowPlaying(token);
            setNowPlaying(playingData);
        }

        fetchData();
    }, [token]);
    
    const changeArtistRange = async (range) => {
        const artistsData = await fetchTopArtists(token, range);
        setTopArtists(artistsData.items);
    };

    const selectPlaylist = async (id, name) => {
        const tracksData = await fetchTracks(token, id);
        setTracks(tracksData.items);
        setSelectedPlaylistName(name);
        setSelectedPlaylistId (id);
        setView('playlist')
    };

    const renderHome = () => {
        // setTracks(null);
        // setSelectedPlaylistName(null);
        // selectedPlaylistId(null)
        setView('home')
    };

    const renderNowPlaying = () => {
        setView('nowplaying');
    };

    if (!token) return <Login/>
    return (
        // OUTER CONTAINER: Column layout to stack Middle Section on top of Player
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#121212', color: 'white' }}>
            
            {/* MIDDLE SECTION: Row layout for Sidebar + Content */}
            {/* This takes up all available space (flex: 1) leaving just enough room for the player at bottom */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* Sidebar */}
                <Sidebar 
                    playlists={playlists} 
                    selectPlaylist={selectPlaylist} 
                    renderHome={renderHome} 
                />

                {/* Main Content Area */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'linear-gradient(to bottom, #2a2a2a, #121212)' }}>
                    {view== "home"&&(
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: 'linear-gradient(to bottom, #2a2a2a, #121212)' }}>
                    
                    {/* Header */}
                    {profile && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                            {profile.images?.length > 0 && <img src={profile.images[0].url} alt="Profile" style={{ width: 60, height: 60, borderRadius: '50%', marginRight: '20px' }} />}
                            <h1>{profile.display_name}</h1>
                        </div>
                    )}

                    {tracks ? (
                        /* Playlist View */
                        <TrackList 
                            tracks={tracks}
                            selectedPlaylistName={selectedPlaylistName}
                            renderHome={renderHome}
                            playTrack={playTrack} />
                            
                    ) : (
                        /* Default View: Top Artists */
                        <div>
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

                            <ArtistView
                                nowPlaying={nowPlaying}
                                topArtists={topArtists}
                                changeArtistRange={changeArtistRange}
                            />
                            
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
                )}

                {view === 'playlist' && (
                        /* PLAYLIST VIEW */
                        <TrackList 
                            tracks={tracks}
                            selectedPlaylistName={selectedPlaylistName}
                            renderHome={renderHome}
                            playTrack={playTrack}
                        />
                    )}

                    {view === 'nowplaying' && (
                        /* Use globalCurrentTrack instead of nowPlaying.item */
                        <NowPlaying currentTrack={globalCurrentTrack} />
                    )}
                </div>
                    
            </div>

            {/* PLAYER: Sits outside the middle flex container, pinned to bottom */}
            {token && <Player
             token={token} 
            onExpand={renderNowPlaying}
            syncTrack={setGlobalCurrentTrack}
            setDeviceId={setDeviceId}
            />}
        </div>
    );
}

export default App;