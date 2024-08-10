import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type ConnectionType = {
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    clients?: Map<string, string>;
    getClientId: (socketId: string) => string | null | undefined;
};

export type HandlerType = ConnectionType & {
    handshakeQuery: {
        channelId: string;
        userName: string;
    };
};

export type ArglistType = {
    [index: string]: string[];
};

type UserType = {
    socketId: string;
    userId: string;
    name: string;
};

export type UserListType = {
    [index: string]: UserType[];
};

type MessageType = {
    _id: any;
    messageId: string;
    text: string;
    channelId: string;
    userId: string;
    userName: string;
};

export type MessageListType = {
    [index: string]: MessageType[];
};

export type TUser = { uid?: string; username?: string; online: boolean };

export type TMessage = {
    id?: string;
    from?: TUser | string;
    to?: TChannel | string;
    content?: string;
    timestamp?: string | Date;
};

export type TChannel = {
    id?: string;
    title?: string;
    description?: string;
    creator?: TUser | string;
    members?: TUser[];
    messages?: TMessage[];
};
