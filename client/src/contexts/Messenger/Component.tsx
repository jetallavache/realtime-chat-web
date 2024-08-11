import React, { useEffect, useReducer } from 'react';

import { IMessengerContextComponentProps } from './interfaces';
import { defaultMessengerContextState, MessengerContextProvider, MessengerReducer } from './Context';
import { useSocketContext } from '../Socket/Context';
import { TChannelObject, TUserObject } from '@/config/interfaces';

const MessengerContextComponent: React.FunctionComponent<IMessengerContextComponentProps> = props => {
    const { children } = props;
    const [MessengerState, MessengerDispatch] = useReducer(MessengerReducer, defaultMessengerContextState);
    const { socket } = useSocketContext().SocketState;

    useEffect(() => {
        /** Start the event listeners */
        startListeners();
    }, []);

    const startListeners = () => {
        /** Get a list of channels */
        socket?.on('receive_channels', (channels: TChannelObject[]) => {
            console.info('List of channels has been received.');
            MessengerDispatch({ type: 'update_channels', payload: channels });
        });

        /** Get a list of users */
        socket?.on('receive_users', (users: TUserObject[]) => {
            console.info('List of users has been received');
            MessengerDispatch({ type: 'update_users', payload: users });
        });
    };

    return (
        <MessengerContextProvider value={{ MessengerState, MessengerDispatch }}>{children}</MessengerContextProvider>
    );
};

export default MessengerContextComponent;
