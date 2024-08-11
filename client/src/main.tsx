import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import SocketContextComponent from './contexts/Socket/Component.tsx';
import MessengerContextComponent from './contexts/Messenger/Component.tsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MessengerContextComponent>
                <SocketContextComponent>
                    <App />
                </SocketContextComponent>
            </MessengerContextComponent>
        </BrowserRouter>
    </React.StrictMode>,
);
