




//fetch playlist
export async function fetchPlaylists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

//fetch tracks

export async function fetchTracks(token, playlistId) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

// Fetch the User's Profile
export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

//medium term is = 6 month

// Fetch the User's Top Artists
export async function fetchTopArtists(token, time_range = "medium_term") {
    // Added the $ before {time_range} 👇
    const result = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=10`, {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(result);
    
    return await result.json();
}

export async function fetchNowPlaying(token) {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` }
    });

    // If nothing is playing, Spotify returns 204 (No Content)
    if (result.status === 204 || result.status > 400) {
        return null;
    }

    return await result.json();
}