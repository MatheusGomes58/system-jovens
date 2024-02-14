import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../components/firebase/firebase';
import '../css/homePage.css';

function MissionDetailsPage() {
    const [mission, setMission] = useState(null);
    const [report, setReport] = useState(null);
    const [reportSubmitted, setReportSubmitted] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const missionId = localStorage.getItem('missionId');
        const email = localStorage.getItem('email')
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
            .where('email','==', email)
            .limit(1)
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    const reportData = snapshot.docs[0].data();
                    setReport(reportData);
                    setReportSubmitted(true);
                } else {
                    setReport();
                    setReportSubmitted(false);
                }
            });

        return () => {
            unsubscribeMission();
            unsubscribeReport();
        };
    }, [navigate]);

    const handleSubmitReport = async (reportData) => {
        const email = localStorage.getItem('email')
        const missionId = localStorage.getItem('missionId');
        if (reportSubmitted) {
            alert('O relatório já foi enviado.');
            return;
        }

        var jsonReport = {
            email: email,
            missionId: missionId,
            text: reportData
        }

        try {
            await db.collection('reports').add(jsonReport);
            setReportSubmitted(true);
            alert('Relatório enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar o relatório:', error);
            alert('Ocorreu um erro ao enviar o relatório. Por favor, tente novamente.');
        }
    };

    if (!mission) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="missionDetailsPage">
            {mission && (
                <>
                    <h1>{mission.title}</h1>
                    <p>{mission.description}</p>
                    {mission.imageURL && <img src={mission.imageURL} alt="Imagem da missão" />}
                </>
            )}
            {report && (
                <>
                    <h2>Relatório</h2>
                    <p>{report.text}</p>
                </>
            )}
            {!report && <ReportForm onSubmit={handleSubmitReport} />}
        </div>
    );
}

function ReportForm({ onSubmit }) {
    const [reportText, setReportText] = useState('');

    const handleTextChange = (event) => {
        setReportText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (reportText.trim() === '') {
            alert('Por favor, preencha o relatório antes de enviar.');
            return;
        }
        onSubmit(reportText);
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={reportText} onChange={handleTextChange} />
            <button type="submit">Enviar Relatório</button>
        </form>
    );
}

export default MissionDetailsPage;
