import React, { useState, useEffect } from "react";
import "./Player.css"; // Ensure this matches your file path

const track = {
    name: "",
    album: {
        images: [{ url: "" }]
    },
    artists: [{ name: "" }]
}

function Player({ token , onExpand, syncTrack,setDeviceId}) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [player, setPlayer] = useState(undefined);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(0.5);


    useEffect(() => {
        //  Define the initialization logic separately
        const initializePlayer = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                if (setDeviceId) setDeviceId(device_id);
                //  AUTO-TRANSFER LOGIC 
                // This tells Spotify to switch playback to this app immediately
                const transferPlayback = async () => {
                    await fetch('https://api.spotify.com/v1/me/player', {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            device_ids: [device_id],
                            play: false, // true = start playing immediately, false = just switch device
                        }),
                    });
                };

                transferPlayback();
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {
                if (!state) return;
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                setPosition(state.position); 
                setDuration(state.duration); 
                syncTrack(state.track_window.current_track);
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            }));

            player.connect();
        };

        //  Check if the script is already there
        if (window.Spotify) {
            initializePlayer(); // Initialize immediately if SDK is ready
        } else {
            // Otherwise, wait for the script to load
            window.onSpotifyWebPlaybackSDKReady = initializePlayer;

          if (!document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
                const script = document.createElement("script");
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }, [token]);

    // Handle clicking on the progress bar to seek
    const handleSeek = (e) => {
        if (!player) return;
        //  Get the width of the progress bar container
        const progressBar = e.target.closest('.progress-bar-bg');
        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const width = rect.width;
        
        // Calculate where the user clicked relative to the left edge
        const clickX = e.clientX - rect.left;
        
        //  Calculate percentage and new time
        const seekPercentage = clickX / width;
        const seekTime = duration * seekPercentage;
        
        //  Update local state immediately (for smooth UI)
        setPosition(seekTime);
        
        //  Tell Spotify to jump to that time
        player.seek(seekTime).then(() => {
            console.log(`Seeked to ${seekTime} ms`);
        });
    };

    


    // --- THE TIMER LOGIC ---
    useEffect(() => {
        if (!is_paused && is_active) {
            // If playing, update the position every 1 second
            const interval = setInterval(() => {
                setPosition(prev => {
                    const newPos = prev + 1000;
                    // Stop if we reach the end of the song
                    return (newPos < duration) ? newPos : duration;
                });
            }, 1000);
            
            // Clean up the timer when paused or unmounted
            return () => clearInterval(interval);
        }
    }, [is_paused, is_active, duration]);


    //  FUNCTION: Handle Volume Change
    const handleVolumeChange = (e) => {
        // This simple version toggles mute/unmute or sets volume
        // Ideally, you'd use a slider input, but here is a simple toggle:
        if (volume > 0) {
            setVolume(0);
            player.setVolume(0);
        } else {
            setVolume(0.5);
            player.setVolume(0.5);
        }
    };

  

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };
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
                <div className="player-left">
                    <img src={current_track.album.images[0].url} className="now-playing__cover" 
                    alt="" 
                    onClick={onExpand} 
                     style={{ cursor: 'pointer' }}
                    />
                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>
                    </div>
                </div>

                <div className="player-center">
                    <div className="player-controls">
                        {/*  WIRED UP BUTTONS */}
                        <button className="btn-spotify" onClick={() => player.toggleShuffle()}>
                            <i className="fas fa-random"></i>
                        </button>
                        
                        <button className="btn-spotify" onClick={() => player.previousTrack()}>
                            <i className="fas fa-step-backward"></i>
                        </button>

                        <button className="btn-spotify btn-circle" onClick={() => player.togglePlay()}>
                            { is_paused ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i> }
                        </button>

                        <button className="btn-spotify" onClick={() => player.nextTrack()}>
                            <i className="fas fa-step-forward"></i>
                        </button>

                        <button className="btn-spotify" onClick={() => player.toggleRepeat()}>
                            <i className="fas fa-redo"></i>
                        </button>
                    </div>

                   <div className="playback-bar">
                        <div className="progress-time">{formatTime(position)}</div>
                        
                        <div 
                            className="progress-bar-bg" 
                            onClick={handleSeek} 
                            style={{ cursor: 'pointer' }} 
                        >
                            <div 
                                className="progress-bar-fg" 
                                style={{ width: `${(position / duration) * 100}%` }}
                            ></div>
                        </div>
                        
                        <div className="progress-time">{formatTime(duration)}</div>
                    </div>
                </div>

                <div className="player-right">
                    {/* 4. VOLUME CONTROL */}
                    <i 
                        className={`fas ${volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'}`} 
                        onClick={handleVolumeChange}
                        style={{ cursor: 'pointer', width: '20px' }}
                    ></i>
                    <div className="volume-bar-bg">
                        {/* This visualizes the volume state */}
                        <div className="volume-bar-fg" style={{ width: `${volume * 100}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;