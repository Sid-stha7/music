import React from 'react';
import './nowPlaying.css';

// Placeholder lyrics (Since Spotify SDK doesn't provide them)
const DEMO_LYRICS = [
    "Verse 1",
    "Caught in a bad romance",
    "Oh-oh-oh-oh-oooh",
    "Oh-oh-oh-oh-oooh",
    "Caught in a bad romance",
    " ",
    "Rah rah ah-ah-ah!",
    "Ro mah ro-mah-mah",
    "Gaga ooh-la-la!",
    "Want your bad romance",
    " ",
    "Verse 2",
    "I want your ugly, I want your disease",
    "I want your everything as long as it's free",
    "I want your love",
    "Love, love, love, I want your love",
    "(Hey!)",
    " ",
    "Chorus",
    "I want your drama, the touch of your hand",
    "I want your leather studded kiss in the sand",
    "I want your love",
    "Love, love, love, I want your love",
    "(Love, love, love, I want your love)",
    " ",
    "Bridge",
    "Walk, walk, fashion baby",
    "Work it, move that bitch crazy",
    "Walk, walk, fashion baby",
    "Work it, move that bitch crazy",
    " ",
    "Outro",
    "Want your bad romance",
    "Caught in a bad romance"
];

function NowPlaying({ currentTrack }) {
    if (!currentTrack) return <div className="np-loading">No track playing</div>;

    const albumImageUrl = currentTrack.album.images?.[0]?.url || "https://via.placeholder.com/350";

    return (
        <div className="np-container">
            
            {/* BACKGROUND BLUR */}
            <div className="np-background" style={{ backgroundImage: `url(${albumImageUrl})` }}></div>

            <div className="np-content">
                
                {/* LEFT: Album Art & Info */}
                <div className="np-left">
                    <img src={albumImageUrl} alt="Album Art" className="np-art" />
                    
                    <div className="np-info">
                        <h1 className="np-title">{currentTrack.name}</h1>
                        <h2 className="np-artist">{currentTrack.artists[0].name}</h2>
                        <p className="np-album">{currentTrack.album.name}</p>
                    </div>
                </div>

                {/* RIGHT: Lyrics UI */}
                <div className="np-right">
                    <h3 className="lyrics-header">Lyrics</h3>
                    <div className="lyrics-container">
                        {DEMO_LYRICS.map((line, index) => (
                            <p 
                                key={index} 
                                className={`lyric-line ${index === 7 ? 'active' : ''}`} // Simulating active line
                            >
                                {line}
                            </p>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default NowPlaying;