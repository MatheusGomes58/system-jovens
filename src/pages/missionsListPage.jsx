import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase/firebase';
import Narrator from '../components/narrador/narrador';
import '../css/homePage.css';
import LogoJA from '../img/userUnknow.png';

function MissionsListPage() {
    const [user, setUser] = useState({});
    const [missions, setMissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        userValidation();
    }, []);

    useEffect(() => {
        const getUserFromFirestore = () => {
            const userEmail = localStorage.getItem('email');
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

    useEffect(() => {
        const getMissionsFromFirestore = () => {
            return db.collection('missions')
                .onSnapshot(snapshot => {
                    const missionsData = [];
                    snapshot.forEach(doc => {
                        const missionData = doc.data();
                        missionsData.push({ id: doc.id, ...missionData });
                    });
                    setMissions(missionsData);
                });
        };

        const unsubscribe = getMissionsFromFirestore();

        return () => {
            unsubscribe();
        };
    }, []);

    async function userValidation() {
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

    if (user.admin) {
        localStorage.setItem('admin', user.admin)
    }

    function handleMissionClick(missonID) {
        localStorage.setItem('missionId',missonID);
        navigate('/mission');
    }

    return (
        <div className="homePage">
            <div className='containerHome'>
                <div className="profileImage" style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profileImg" />
                </div>
                <h2 className='functionLabel'>{user.function ? user.function : 'Cargo Indefinido'}</h2>
            </div>
            <div className='containerHome'>
                <div className='missionCard'>
                    <h2 className='missionCardHeader'>Missions</h2>
                    <div className='missionCardList'>
                        {missions.map(mission => (
                            <div key={mission.id} className="missionCardBody" onClick={() => handleMissionClick(mission.id)}>
                                <div className='missionCardContent'>
                                    <h3>{mission.title}</h3>
                                    <p>{mission.description}</p>
                                </div>
                                <div className='missionCardStatus'>
                                    {mission.status === 'completed' && <i className="fas fa-check-circle"></i>}
                                    {mission.status === 'error' && <i className="fas fa-exclamation-circle"></i>}
                                    {mission.status === 'in_progress' && <i className="fas fa-spinner"></i>}
                                    {mission.status === 'not_started' && <i className="fas fa-circle"></i>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <h2 className='missionCardFooter'>Missions</h2>
                </div>
            </div>
        </div>
    );
}

export default MissionsListPage;
