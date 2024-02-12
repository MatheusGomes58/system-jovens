import React, { useState, useEffect } from 'react';
import { realTimeDB } from '../firebase/firebase';
import LogoJA from '../../img/userUnknow.png';
import './chat.css';

const Chat = ({ email }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        const messagesRef = realTimeDB.ref('messages');

        messagesRef.on('value', snapshot => {
            const messageData = snapshot.val();
            if (messageData) {
                const messageList = Object.keys(messageData).map(key => ({
                    id: key,
                    ...messageData[key]
                }));
                setMessages(messageList);
            } else {
                setMessages([]);
            }
        });

        // Obter usuário do localStorage apenas uma vez quando o componente é montado
        const storedUser = localStorage.getItem('chat');
        try {
            // Verificar se o valor armazenado é um JSON válido
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser ? parsedUser : {});
        } catch (error) {
            console.error('Erro ao analisar o usuário do localStorage:', error);
            setUser({});
        }

        return () => messagesRef.off('value');
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            const timestamp = Date.now();
            const newMessageRef = realTimeDB.ref('messages').push();
            newMessageRef.set({
                user: email,
                text: message,
                timestamp: timestamp
            });
            setMessage('');
        }
    };

    return (
        <div className="chat-container" style={{ position: 'relative', display: 'inline-block' }}>
            <div className='headerChat'>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={user.img ? user.img : LogoJA} alt="Profile" className="profilesImg" />
                </div>
                <div className='functionLabel'>
                    <h2>{user.name ? user.name : 'Nome Indefinido'}</h2>
                    <h4>{user.team ? user.team : 'Time Indefinido'}</h4>
                </div>
            </div>
            <div className="chat-messages" >
                {messages.map(msg => (
                    <div className={`align-${msg.user === email ? 'right' : 'left'}`} key={msg.id}>
                        <div className={`message ${msg.user === email ? 'sent' : 'received'}`}>
                            <div className="message-content">
                                <strong>{msg.user}:</strong> {msg.text}
                                <span className="timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;
