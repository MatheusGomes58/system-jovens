import React from 'react';
import { useNavigate } from 'react-router-dom';
import './menu.css'

function MenuOptions() {
    const history = useNavigate();

    function acessHome(){
        history('/home'); 
    }

    function acessTeam(){
        history('/team'); 
    }

    function acessSchedule(){
        history('/schedule'); 
    }

    return (
        <div className='addEvent'>
            <button className='btnCircle' onClick={acessHome}>
                <i className="fas fa-user"></i>
            </button>
            <button className='btnCircle' onClick={acessTeam}>
                <i className="fas fa-users"></i>
            </button>
            <button className='btnCircle' onClick={acessSchedule}>
                <i className="fas fa-calendar-alt"></i>
            </button>
        </div>
    );
}

export default MenuOptions;

