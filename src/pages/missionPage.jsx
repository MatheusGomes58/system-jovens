import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../components/firebase/firebase';
import Slides from '../components/slideShow/slideShow';
import ReportForm from '../components/report/report';
import '../css/homePage.css';

function MissionDetailsPage() {
    const [mission, setMission] = useState(null);
    const [report, setReport] = useState(null);
    const [reportSubmitted, setReportSubmitted] = useState(true);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const missionId = localStorage.getItem('missionId');
        const email = localStorage.getItem('email');

        const unsubscribeMission = db.collection('missions').doc(missionId)
            .onSnapshot(snapshot => {
                if (snapshot.exists) {
                    setMission({ id: snapshot.id, ...snapshot.data() });
                } else {
                    navigate('/missions');
                }
            });

        const unsubscribeReport = db.collection('reports')
            .where('missionId', '==', missionId)
            .where('email', '==', email)
            .limit(1)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    const reportData = snapshot.docs[0].data();
                    setReport(reportData);
                    setReportSubmitted(true);
                } else {
                    setReport(null);
                    setReportSubmitted(false);
                }
            });

        return () => {
            unsubscribeMission();
            unsubscribeReport();
        };
    }, [navigate]);

    const handleImageChange = (event) => {
        const files = event.target.files;
        const imagesArray = [...images];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                imagesArray.push(e.target.result);

                if (imagesArray.length === files.length + images.length) {
                    setImages(imagesArray);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmitReport = async (reportData) => {
        const email = localStorage.getItem('email');
        const missionId = localStorage.getItem('missionId');

        if (reportSubmitted) {
            alert('O relatório já foi enviado.');
            return;
        }

        const jsonReport = {
            email: email,
            missionId: missionId,
            text: reportData,
            status: 'completed',
            images: []
        };

        try {
            const imageUrls = await Promise.all(images.map(uploadImage));
            jsonReport.images = imageUrls;

            await db.collection('reports').add(jsonReport);
            setReportSubmitted(true);
            alert('Relatório enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar o relatório:', error);
            alert('Ocorreu um erro ao enviar o relatório. Por favor, tente novamente.');
        }
    };

    const uploadImage = async (imageData) => {
        try {
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`images/${Date.now()}`);
            const snapshot = await imageRef.putString(imageData, 'data_url');
            return await snapshot.ref.getDownloadURL();
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            throw error;
        }
    };

    if (!mission) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="homePage">
            <div className='containerHome'>
                <h1 className='functionLabel'>{mission.title}</h1>
                <h3>{mission.description}</h3>
                {mission.images && <Slides images={mission.images} />}
            </div>

            {report && (
                <div className='containerHome'>
                    <h2>Relatório</h2>
                    <p>{report.text}</p>
                    <Slides images={report.images} />
                </div>
            )}

            {!report && (
                <div className='containerHome'>
                    <Slides images={images} />
                    <ReportForm onSubmit={handleSubmitReport} addImage={handleImageChange} />
                </div>
            )}
        </div>
    );
}

export default MissionDetailsPage;
