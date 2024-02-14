import React, { useState } from 'react';

function ReportForm({ onSubmit, addImage }) {
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
            <input type="file" accept="image/*" multiple onChange={addImage} />
            <button type="submit">Enviar Relatório</button>
        </form>
    );
}

export default ReportForm;