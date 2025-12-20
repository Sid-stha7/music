import React from 'react';

function TrackList({ tracks, selectedPlaylistName, renderHome }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={renderHome} 
                    style={{ marginRight: '20px', background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
                >
                    ←
                </button>
                <h2 style={{ margin: 0 }}>{selectedPlaylistName}</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tracks.map((item, index) => (
                    <div key={item.track.id + index} style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#181818', borderRadius: '5px' }}>
                        <span style={{ width: '30px', color: '#b3b3b3' }}>{index + 1}</span>
                        {item.track.album.images.length > 0 && (
                            <img src={item.track.album.images[0].url} style={{ width: '40px', height: '40px', marginRight: '15px' }} alt="Art" />
                        )}
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{item.track.name}</div>
                            <div style={{ fontSize: '14px', color: '#b3b3b3' }}>
                                {item.track.artists.map(a => a.name).join(', ')}
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#b3b3b3', fontSize: '14px' }}>
                            {Math.floor(item.track.duration_ms / 60000)}:
                            {((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrackList;