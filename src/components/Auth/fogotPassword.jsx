import React, { useState } from 'react';
import { auth } from '../firebase/firebase'; // Importe o auth do Firebase
import { sendPasswordResetEmail } from 'firebase/auth';
import './login.css';

function ForgotPasswordForm() {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            alert('Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail.');
        } catch (error) {
            alert(`Erro ao enviar e-mail de redefinição de senha: ${error.message}`);
        }
    };

    return (
        <div id="ForgotPasswordForm">
            <input
                className="inputLogin"
                type="email"
                id="EmailUser"
                placeholder="Seu E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className="boxButton">
                <button className="btnAuth" onClick={handleForgotPassword}>Enviar E-mail de Redefinição de Senha</button>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;
