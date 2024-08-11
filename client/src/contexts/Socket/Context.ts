import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { ISocketContextAction, ISocketContextProps, ISocketContextState, TSocketStatus } from './interfaces';

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    status: 'disconnected',
    clientId: '',
    clients: [],
};

export const SocketReducer = (state: ISocketContextState, action: ISocketContextAction) => {
    console.log(`Socket context. Message received, - Action: ${action.type}, - Payload: `, action.payload);

    switch (action.type) {
        case 'update_socket':
            return { ...state, socket: action.payload as Socket };

        case 'update_status':
            return { ...state, status: action.payload as TSocketStatus };

        case 'update_clientId':
            return { ...state, clientId: action.payload as string };

        case 'update_clients':
            return { ...state, clients: action.payload as string[] };

        case 'remove_client':
            return {
                ...state,
                clients: state.clients.filter(clietnId => clietnId !== (action.payload as string)),
            };

        default:
            return { ...state };
    }
};

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {},
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
