import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../components/firebase/firebase';
import '../css/homePage.css';
import LogoJA from '../img/userUnknow.png';

function ProfilePage() {
    const [user, setUser] = useState({});
    const [editableFields, setEditableFields] = useState({
        name: '',
        age: '',
        team: ''
    });
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
            const userEdit = localStorage.getItem('editUser');
            let userQuerySnapshot;
            if (userEdit) {
                userQuerySnapshot = await db.collection('users').where('email', '==', userEdit).get();
            } else {
                userQuerySnapshot = await db.collection('users').where('email', '==', userEmail).get();
            }
            
            if (!userQuerySnapshot.empty) {           
                userQuerySnapshot.forEach(doc => {
                    const userData = doc.data(); // Aqui acessamos os dados de cada documento
                    setUser({ id: doc.id, ...userData });
                    setEditableFields({
                        name: userData.name || '',
                        age: userData.age || '',
                        team: userData.team || '',
                        email: userData.email || '',
                    });
                });
            } 
        } catch (error) {
        }
    }

    const handleImageClick = () => {
        const confirmChange = window.confirm("Deseja trocar a foto de perfil?");
        if (confirmChange) {
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

    const handleEditButtonClick = async () => {
        try {
            await db.collection('users').doc(user.id).update({
                name: editableFields.name,
                age: editableFields.age,
                team: editableFields.team
            });
            console.log('Informações do usuário atualizadas com sucesso.');

            localStorage.removeItem('editUser');
            navigate(-1); 
        } catch (error) {
            console.error('Erro ao atualizar informações do usuário no Firestore:', error);
        }
    };

    return (
        <div className="homePage">
            <div className='containerHome'>
                <div className="profileImage" onClick={handleImageClick} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profileImg" />
                    <button className='configButton'>
                        <i className="fas fa-pencil-alt"></i>
                    </button>
                </div>
                <h2 className='functionLabel'>{user.function ? user.function : 'Cargo Indefinido'}</h2>

                <input id="fileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            <div className='containerHome'>
                <div className="missionsCard">
                    <input
                        className='inputText'
                        type="text"
                        placeholder="Nome:"
                        value={editableFields.name}
                        onChange={(e) => setEditableFields({ ...editableFields, name: e.target.value })}
                    />
                    <input
                        className='inputText'
                        type="number"
                        placeholder="Idade:"
                        value={editableFields.age}
                        onChange={(e) => setEditableFields({ ...editableFields, age: e.target.value })}
                    />
                    <input
                        className='inputText'
                        type="text"
                        placeholder="Email:"
                        value={editableFields.email}
                        readOnly
                    />
                    <input
                        className='inputText'
                        type="text"
                        placeholder="team:"
                        value={editableFields.team}
                        onChange={(e) => setEditableFields({ ...editableFields, team: e.target.team })}
                        readOnly
                    />
                    <button className='buttonMissions' onClick={handleEditButtonClick}>
                        <h2>Editar</h2>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
