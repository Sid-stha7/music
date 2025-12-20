import React, { useState, useEffect } from "react";
import "./Player.css"; // Ensure this matches your file path

const track = {
    name: "",
    album: {
        images: [{ url: "" }]
    },
    artists: [{ name: "" }]
}

function Player({ token }) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [player, setPlayer] = useState(undefined);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, [token]);

    if (!is_active) { 
        return ( 
            <div className="container">
                <div className="main-wrapper" style={{ width: '100%', textAlign: 'center', color: '#b3b3b3' }}>
                    <b> Instance not active. Transfer your playback using your Spotify app </b>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container">
                
                {/* 1. LEFT SECTION: Album Art and Artist */}
                <div className="player-left">
                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>
                    </div>
                </div>

                {/* 2. CENTER SECTION: Controls and Progress Bar */}
                <div className="player-center">
                    
                    <div className="player-controls">
                        <button className="btn-spotify" >
                            <i className="fas fa-random"></i> 
                        </button>

                        <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                            <i className="fas fa-step-backward"></i> 
                        </button>

                        <button className="btn-spotify btn-circle" onClick={() => { player.togglePlay() }} >
                            { is_paused ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i> }
                        </button>

                        <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                            <i className="fas fa-step-forward"></i> 
                        </button>

                        <button className="btn-spotify" >
                            <i className="fas fa-redo"></i> 
                        </button>
                    </div>

                    <div className="playback-bar">
                        <div className="progress-time">0:00</div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fg" style={{ width: '0%' }}></div>
                        </div>
                        <div className="progress-time">0:00</div>
                    </div>

                </div>

                {/* 3. RIGHT SECTION: Volume Controls */}
                <div className="player-right">
                    <i className="fas fa-volume-up"></i>
                    <div className="volume-bar-bg">
                        <div className="volume-bar-fg" style={{ width: '50%' }}></div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Player;