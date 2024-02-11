import React, { useState, useEffect } from 'react';
import Members from '../components/members/members';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../components/firebase/firebase';
import '../css/homePage.css';
import LogoJA from '../img/logo.png';

function HomePage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        userValidation();
        fetchUsers();
    }, []);

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

        try {
            // Realizar uma consulta para encontrar o documento com o email do usuário
            const userQuerySnapshot = await db.collection('users').where('email', '==', userEmail).get();

            if (!userQuerySnapshot.empty) {
                // Pegar o primeiro documento encontrado
                const userDocSnapshot = userQuerySnapshot.docs[0];

                // Atualizar o status do usuário no Firestore
                await userDocSnapshot.ref.update({ online: false });
                console.log('Status do usuário atualizado para online');
            } else {
                console.log('Documento do usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao salvar o status do usuário no Firestore:', error);
        }
    }


    async function fetchUsers() {
        try {
            const usersCollection = await db.collection('users').where('status', '==', true).get();
            const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
            // Recuperar os usuários autenticados
            const onlineUsersByEmail = {};
            await auth.listUsers().then(users => {
                users.forEach(user => {
                    onlineUsersByEmail[user.email] = true;
                });
            });
    
            const usersWithOnlineStatus = usersData.map(user => {
                const isOnline = onlineUsersByEmail[user.email] || false;
                return { ...user, isOnline };
            });
    
            setUsers(usersWithOnlineStatus);
        } catch (error) {
            console.error('Error fetching users: ', error);
        }
    }
    
    

    return (
        <div className="homePage">
            <div className='containerHome'>
                <img src={LogoJA} className='LogoJA' />
                <h2 className='functionLabel'>Membros</h2>
            </div>
            <div className='containerHome'>
                <Members users={users} />
            </div>
        </div>
    );
}

export default HomePage;
