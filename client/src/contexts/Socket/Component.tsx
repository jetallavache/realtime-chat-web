import React, { useCallback, useEffect, useReducer, useState } from 'react';

import { ISocketContextComponentProps } from './interfaces';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './Context';

import { useSocket } from '@/hooks/useSocket';
import config from '@/config/constants';
import { useMessengerContext } from '../Messenger/Context';
import authProvider from '@/config/authProvider';

const { wsUrl, apiUrl } = config;

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = props => {
    const { children } = props;
    const { user } = useMessengerContext().MessengerState;
    const [loading, setLoading] = useState(true);
    const { checkUser } = authProvider(apiUrl);

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);

    const socket = useSocket(wsUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false,
    });

    const startListeners = useCallback(() => {
        /** Messages */
        socket.on('client_connected', (clients: string[]) => {
            console.info('User connected message received');
            SocketDispatch({ type: 'update_clients', payload: clients });
        });

        /** Messages */
        socket.on('client_disconnected', (clientId: string) => {
            console.info('User disconnected message received');
            SocketDispatch({ type: 'remove_client', payload: clientId });
        });

        /** Reconnect event */
        socket.io.on('reconnect', attempt => {
            console.info('Reconnected on attempt: ', attempt);
            sendHandshake();
        });

        /** Reconnect attempt event */
        socket.io.on('reconnect_attempt', attempt => {
            console.info('Reconnection attempt: ', attempt);
        });

        /** Reconnect error */
        socket.io.on('reconnect_error', error => {
            console.info('Reconnect error: ', error);
        });

        /** Reconnect failed */
        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure.');
            alert(
                'We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later.',
            );
        });
    }, []);

    const sendHandshake = useCallback(async () => {
        console.info('Sending handshake to server ...');

        socket.emit('handshake', checkUser()?.data.uid, (clientId: string, clients: string[]) => {
            console.info('User handshake callback message received.');
            SocketDispatch({ type: 'update_clientId', payload: clientId });
            SocketDispatch({ type: 'update_clients', payload: clients });

            setLoading(false);
        });
    }, []);

    useEffect(() => {
        /** Connect to Web Socket */
        socket.connect();
        console.info('Connect to ', wsUrl);

        /** Save socket in context */
        SocketDispatch({ type: 'update_socket', payload: socket });
        SocketDispatch({ type: 'update_status', payload: 'connected' });

        /** Start event listeners */
        startListeners();

        /** Send handshake */
        sendHandshake();
    }, []);

    if (loading) return <p>Loading Socket IO ...</p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>;
};

export default SocketContextComponent;
