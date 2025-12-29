import React from 'react';

function Sidebar({ playlists, selectPlaylist, renderHome, nowPlaying }) {

    const logout = () => {
        window.localStorage.removeItem("token");
        window.location.reload(); 
    };

    return (
        <div style={{ 
            width: '300px',
            backgroundColor: '#000', 
            padding: '20px', 
            flexShrink: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', 
            boxSizing: 'border-box' 
        }}>
            
            {/* Header */}
            <div onClick={renderHome} style={{ cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold', fontSize: '24px', color: 'white' }}>
                🏠 Home
            </div>
            
            <h3 style={{ marginBottom: '20px', color: '#b3b3b3', fontSize: '12px', letterSpacing: '2px' }}>YOUR LIBRARY</h3>
            
            {/* Scrollable Playlist Area */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {playlists ? playlists.map(playlist => (
                        <div 
                            key={playlist.id}
                            onClick={() => selectPlaylist(playlist.id, playlist.name)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '5px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            {/* Playlist Image */}
                            {playlist.images && playlist.images.length > 0 ? (
                                <img 
                                    src={playlist.images[0].url} 
                                    alt={playlist.name}
                                    style={{ 
                                        width: '50px', 
                                        height: '50px', 
                                        borderRadius: '4px', 
                                        marginRight: '15px',
                                        objectFit: 'cover'
                                    }} 
                                />
                            ) : (
                                // Fallback grey box if no image
                                <div style={{ width: '50px', height: '50px', backgroundColor: '#333', borderRadius: '4px', marginRight: '15px' }}></div>
                            )}

                            {/* Text Info */}
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ 
                                    color: 'white', 
                                    fontSize: '15px', 
                                    fontWeight: '500', 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis' 
                                }}>
                                    {playlist.name}
                                </div>
                                <div style={{ 
                                    color: '#b3b3b3', 
                                    fontSize: '13px', 
                                    marginTop: '4px',
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis' 
                                }}>
                                    Playlist • {playlist.owner.display_name}
                                </div>
                            </div>
                        </div>
                    )) : <p style={{color: 'grey'}}>Loading...</p>}

                </div>
            </div>

            {/* --- NOW PLAYING WIDGET (Bottom) --- */}
            {nowPlaying && nowPlaying.item && (
                <div style={{ marginBottom: '20px', borderTop: '1px solid #282828', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {nowPlaying.item.album.images[0] && (
                            <img 
                                src={nowPlaying.item.album.images[0].url} 
                                alt="Album Art" 
                                style={{ width: '60px', height: '60px', borderRadius: '5px' }} 
                            />
                        )}
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {nowPlaying.item.name}
                            </div>
                            <div style={{ color: '#b3b3b3', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {nowPlaying.item.artists.map(artist => artist.name).join(', ')}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Button */}
            <div>
                <button 
                    onClick={logout} 
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #b3b3b3',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;