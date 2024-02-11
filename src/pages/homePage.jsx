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
                await userDocSnapshot.ref.update({ online: false });
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


    const handleImageClick = () => {
        const confirmChange = window.confirm("Deseja trocar a foto de perfil?");
        if (confirmChange) {
            // Abrir o gerenciador de arquivos
            document.getElementById('fileInput').click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(file.name);
            await fileRef.put(file);
            const fileUrl = await fileRef.getDownloadURL();
            await db.collection('users').doc(user.id).update({
                img: fileUrl
            });
        }
    };

    return (
        <div className="homePage">
            <div className='containerHome'>
                <div className="profileImage" onClick={handleImageClick}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profileImg" />
                    <h2 className='functionLabel'>{user.function ? user.function : 'Cargo Indefinido'}</h2>
                </div>
                <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            <div className='containerHome'>
                <div className="missionsCard">
                    <input className='inputText' type="text" placeholder="Nome:" value={user.name ? user.name : 'Nome Indefinido'} disabled />
                    <input className='inputText' type="text" placeholder="Equipe:" value={user.team ? user.team : 'Time Indefinido'} disabled />
                    <button className='buttonMissions'>
                        <h2>MINHAS MISSÕES</h2>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
