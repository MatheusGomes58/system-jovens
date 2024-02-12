import '../css/autenticationPage.css';
import LoginForm from '../components/Auth/login'
import RegisterForm from '../components/Auth/register'
import { db, auth } from '../components/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import LogoJA from '../img/logo.png';
import React, { useState, useEffect } from 'react';
import ForgotPasswordForm from '../components/Auth/fogotPassword';

function Auth() {
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    async function userValidation() {
        const currentUser = auth.currentUser;
        const authTime = localStorage.getItem('authTime');
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - parseInt(authTime, 10);

        const threeHoursInMs = 3 * 60 * 60 * 1000;
        if (timeElapsed < threeHoursInMs) {
            // Se o tempo decorrido desde a última autenticação for maior que 3 horas, redirecione para a página de login
            navigate('/home');
            return;
        }

        try {
            // Realizar uma consulta para encontrar o documento com o email do usuário
            const userQuerySnapshot = await db.collection('users').where('email', '==', currentUser.email).get();

            if (!userQuerySnapshot.empty) {
                // Pegar o primeiro documento encontrado
                const userDocSnapshot = userQuerySnapshot.docs[0];

                // Atualizar o status do usuário no Firestore
                await userDocSnapshot.ref.update({ online: false });
                console.log('Status do usuário atualizado para online');

                // Redirecionar para a página inicial após a validação do usuário
                navigate('/home');
            } else {
                console.log('Documento do usuário não encontrado');
                navigate('/');
            }
        } catch (error) {
            console.error('Erro ao salvar o status do usuário no Firestore:', error);
            navigate('/');
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
                            className='switch'
                            onClick={() => handleTabSwitch('login')}
                        >
                            Log In
                        </div>
                        <div
                            className='switch'
                            onClick={() => handleTabSwitch('register')}
                        >
                            Criar conta
                        </div>
                    </div>
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
}

export default Auth;

