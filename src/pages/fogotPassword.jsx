import '../css/autenticationPage.css';
import { db, auth } from '../components/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import LogoJA from '../img/logo.png';
import React, { useState } from 'react';
import ForgotPasswordForm from '../components/Auth/fogotPassword';

function Auth() {
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    async function userValidation() {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigate('/');
            return;
        }

        const userEmail = currentUser.email;

        const authTime = localStorage.getItem('authTime');
        if (!authTime) {
            navigate('/');
            return;
        }

        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - parseInt(authTime, 10);

        const threeHoursInMs = 3 * 60 * 60 * 1000;
        if (timeElapsed > threeHoursInMs) {
            navigate('/');
            return;
        }
    }



    const handleTabSwitch = (tab) => {
        navigate('/');
    };

    return (
        <div className="Auth">
            <div className='containerAuth'>
                <img src={LogoJA} className='LogoJA' />
            </div>
            <div className='containerAuth'>
                <div className="container">
                    <div className="sliderLogin">
                        <div
                            className={`switch ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('login')}
                        >
                            Logar
                        </div>
                        <div
                            className={`switch ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('register')}
                        >
                            Registrar
                        </div>
                    </div>
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
}

export default Auth;

