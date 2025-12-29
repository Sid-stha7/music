import React from 'react';

function ArtistView({ nowPlaying, topArtists, changeArtistRange }) {
    return (
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

            {/* Header with Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Your Top Artists</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => changeArtistRange('short_term')} style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Last Month</button>
                    <button onClick={() => changeArtistRange('medium_term')} style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>6 Months</button>
                    <button onClick={() => changeArtistRange('long_term')} style={{ padding: '8px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>All Time</button>
                </div>
            </div>

            {/* The Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {topArtists && topArtists.map(artist => (
                    <div key={artist.id} style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        {artist.images.length > 0 && <img src={artist.images[0].url} alt={artist.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />}
                        <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{artist.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArtistView;