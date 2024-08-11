import { TUserObject } from '@/config/interfaces';
import React, { PropsWithChildren } from 'react';
import { Socket } from 'socket.io-client';

export type TSocketStatus = 'connected' | 'disconnected';

export interface ISocketContextState {
    socket: Socket | undefined;
    status: TSocketStatus;
    clientId: string;
    clients: string[];
}

export type TSocketContextAction =
    | 'update_socket'
    | 'update_status'
    | 'update_clientId'
    | 'update_clients'
    | 'remove_client';

export type TSocketContextPayload = string | string[] | Socket | TSocketStatus | TUserObject[] | TUserObject | null;

export interface ISocketContextAction {
    type: TSocketContextAction;
    payload: TSocketContextPayload;
}

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextAction>;
}

export interface ISocketContextComponentProps extends PropsWithChildren {}
