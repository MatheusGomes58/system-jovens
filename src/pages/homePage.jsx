import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../components/firebase/firebase';
import '../css/homePage.css';
import LogoJA from '../img/userUnknow.png';

function HomePage() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        userValidation();
    }, []);


    async function userValidation() {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigate('/');
            return;
        }

        const userEmail = currentUser.email;

        const authTime = localStorage.getItem('authTime');
        if (!authTime || !userEmail) {
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

        try {
            // Realizar uma consulta para encontrar o documento com o email do usuário
            const userQuerySnapshot = await db.collection('users').where('email', '==', userEmail).get();

            if (!userQuerySnapshot.empty) {
                // Pegar o primeiro documento encontrado
                const userDocSnapshot = userQuerySnapshot.docs[0];

                // Atualizar o status do usuário no Firestore
                await userDocSnapshot.ref.update({ online: true });
                console.log('Status do usuário atualizado para online');
            } else {
                console.log('Documento do usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao salvar o status do usuário no Firestore:', error);
        }
    }




    useEffect(() => {
        const getUserFromFirestore = () => {
            const currentUser = auth.currentUser;
            const userEmail = currentUser.email;
            return db.collection('users')
                .where('email', '==', userEmail)
                .onSnapshot(snapshot => {
                    if (!snapshot.empty) {
                        const userData = snapshot.docs[0].data();
                        const userId = snapshot.docs[0].id;
                        setUser({ id: userId, ...userData }); // Adicionando o ID do documento aos dados do usuário
                    }
                });
        };

        const unsubscribe = getUserFromFirestore();

        return () => {
            unsubscribe();
        };
    }, []);


    function editUserAcess() {
        localStorage.removeItem('editUser');
        navigate('/profile');
    }

    return (
        <div className="homePage">
            <div className='containerHome'>
                <div className="profileImage"  style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profileImg" />
                    <button className='configButton' onClick={editUserAcess}>
                        <i className="fas fa-cog"></i>
                    </button>
                </div>

                <h2 className='functionLabel'>{user.function ? user.function : 'Cargo Indefinido'}</h2>
                <div className="userLevelFlag">
                    <span className="userLevel">{user.level ? user.level : 'Nível Indefinido'}</span>
                </div>

            </div>
            <div className='containerHome'>
                <div className="missionsCard">
                    <input className='inputText' type="text" placeholder="Nome:" value={user.name ? user.name : 'Nome Indefinido'} readOnly />
                    <input className='inputText' type="text" placeholder="Idade:" value={user.age ? user.age : 'Idade Indefinida'} readOnly />
                    <input className='inputText' type="text" placeholder="Email:" value={user.email ? user.email : 'Email Indefinido'} readOnly />
                    <input className='inputText' type="text" placeholder="Equipe:" value={user.team ? user.team : 'Time Indefinido'} readOnly />
                    <button className='buttonMissions'>
                        <h2>MINHAS MISSÕES</h2>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
