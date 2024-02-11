import React from 'react';
import './members.css';
import { useNavigate } from 'react-router-dom';
import LogoJA from '../../img/userUnknow.png';

function Members({ users, isAdmin }) {
    const navigate = useNavigate();
    const handleEditButtonClick = (email) => {
        localStorage.setItem('editUser', email)
        navigate('/profile');
    };
   
    return (
        users.map(user => (
            <label key={user.id} className='userList'>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profilesImg" />
                    <div className={user.online? "onlineIndicator" : "offlineIndicator"}></div>
                </div>
                <h2 className='functionLabel'>{user.name ? user.name : 'Nome Indefinido'}</h2>
                {isAdmin && (
                    <button className="configsButton" onClick={() => handleEditButtonClick(user.email)}>
                        <i className="fas fa-cog"></i>
                    </button>
                )}
            </label>
        ))
    );
}

export default Members;
