import React from 'react';
import './members.css';
import LogoJA from '../../img/userUnknow.png';

function Members({ users }) {
    return (
        users.map(user => (
            <label key={user.id} className='userList'>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profilesImg" />
                    <div className={user.online? "onlineIndicator" : "offlineIndicator"}></div>
                </div>
                <h2 className='functionLabel'>{user.name ? user.name : 'Nome Indefinido'}</h2>
            </label>
        ))
    );
}

export default Members;
