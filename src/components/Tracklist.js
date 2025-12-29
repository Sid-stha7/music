import React from 'react';


function TrackList({ tracks, selectedPlaylistName, renderHome, playTrack }) {
    
    return (
        <div style={{ padding: '20px' }}>
            <button 
                onClick={renderHome}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' }}
            >
                ← Back
            </button>
            
            <h2 style={{ marginBottom: '30px' }}>{selectedPlaylistName}</h2>
            
            <div className="track-list">
                {tracks.map((item, index) => (
                   

                   
                    <div 
                        key={item.track.id} 
                        className="track-row"
                        onClick={() => playTrack(item.track.uri )} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '15px', 
                            cursor: 'pointer', 
                            padding: '10px',
                            borderRadius: '5px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#282828'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ marginRight: '20px', color: '#b3b3b3' }}>{index + 1}</span>
                        
                        {item.track.album.images.length > 0 && (
                            <img 
                                src={item.track.album.images[0].url} 
                                alt="album art" 
                                style={{ width: '40px', height: '40px', marginRight: '20px' }} 
                            />
                        )}
                        
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '16px' }}>{item.track.name}</div>
                            <div style={{ fontSize: '14px', color: '#b3b3b3' }}>{item.track.artists[0].name}</div>
                        </div>
                        
                        <div style={{ color: '#b3b3b3' }}>
                            {/* Simple duration formatter */}
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