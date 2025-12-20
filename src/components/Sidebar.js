import React from 'react';

function Sidebar({ playlists, selectPlaylist, renderHome }) {
    return (
        <div style={{ width: '250px', backgroundColor: '#000', padding: '20px', flexShrink: 0 }}>
            <div onClick={renderHome} style={{ cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold', fontSize: '24px' }}>🏠 Home</div>
            <h3 style={{ marginBottom: '20px', color: '#b3b3b3' }}>Your Library</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {playlists ? playlists.map(playlist => (
                    <li
                        key={playlist.id}
                        onClick={() => selectPlaylist(playlist.id, playlist.name)}
                        style={{ marginBottom: '15px', cursor: 'pointer', opacity: 0.8, fontSize: '14px' }}
                    >
                        {playlist.name}
                    </li>
                )) : <p>Loading...</p>}
            </ul>
        </div>
    );
}

export default Sidebar;