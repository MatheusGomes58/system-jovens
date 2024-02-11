import React, { useState, useEffect } from 'react';
import Members from '../components/members/members';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../components/firebase/firebase';
import '../css/homePage.css';
import LogoJA from '../img/logo.png';

function TeamPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});

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
            const userQuerySnapshot = await db.collection('users').where('email', '==', userEmail).get();
            if (!userQuerySnapshot.empty) {
                const userDocSnapshot = userQuerySnapshot.docs[0];
                await userDocSnapshot.ref.update({ online: true });
            }
        } catch (error) {
            console.error('Erro ao salvar o status do usuário no Firestore:', error);
        }
    }


    async function fetchUsers() {
        try {
            const usersCollection = await db.collection('users').where('status', '==', true).get();
            const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users: ', error);
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


    return (
        <div className="homePage">
            <div className='containerHome'>
                <img src={LogoJA} className='LogoJA' />
                <h2 className='functionLabel'>Membros</h2>
            </div>
            <div className='containerHome'>
                <Members
                    users={users}
                    isAdmin={user.team == 'ADM'? true : false}
                />
            </div>
        </div>
    );
}

export default TeamPage;
