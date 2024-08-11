import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

import { corsOptions } from '../utils/cors.options';
import messengerHandlers from '../../ws/messenger';
import channelHandlers from '../../ws/channel';

export default class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    /** Master list of all connected clients | [clientId]: socketId */
    public clients: { [uid: string]: string };

    constructor(server: HTTPServer) {
        ServerSocket.instance = this;
        this.clients = {};

        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: corsOptions,
        });

        this.io.on('connect', this.StartListeners);

        console.log('🚀 Socket IO started.');
    }

    StartListeners = (socket: Socket) => {
        socket.on('handshake', async (userId: string, callback: (clientId: string, clients: string[]) => void) => {
            console.info('Handshake received from: ' + socket.id);

            const reconnected = Object.values(this.clients).includes(socket.id);

            if (reconnected) {
                console.info('This client has reconnected.');

                let clientId = this.getClientId(socket.id);
                let clients = Object.values(this.clients);
                console.log('Clients(reconnect): ', this.clients);

                if (clientId) {
                    console.info('Sending callback for reconnect ...');
                    callback(clientId, clients);
                    return;
                }
            }

            const clientId = v4();
            this.clients[clientId] = socket.id;
            console.log('Clients(new): ', this.clients);

            const clients = Object.values(this.clients);
            console.info('Sending callback ...');
            callback(clientId, clients);

            this.eventEmmiter(
                'client_connected',
                clients.filter(id => id !== socket.id),
                clients,
            );
        });

        socket.on('disconnecting', (reason: any) => {
            console.info('Disconnecting... ', socket.id, reason);
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit('client_has_left', socket.id);
                }
            }
        });

        socket.on('disconnect', () => {
            console.info('Disconnect received from: ' + socket.id);
            const clientId = this.getClientId(socket.id);

            if (clientId) {
                delete this.clients[clientId];
                const clients = Object.values(this.clients);
                this.eventEmmiter('client_disconnected', clients, socket.id);
            }
        });

        messengerHandlers({ io: this.io, socket, clients: this.clients, getClientId: this.getClientId });

        channelHandlers({ io: this.io, socket, clients: this.clients, getClientId: this.getClientId });
    };

    /**
     * Send a message through socket
     * @param nameEvent The name of the event, ex: handshake
     * @param users List of socket id's
     * @param payload Any info needed by the user for state updates
     */
    eventEmmiter = (eventName: string, clients: string[], payload?: Object) => {
        console.info("Emitting event '" + eventName + "', - to ", clients, ', - payload ', payload);
        clients.forEach(id => (payload ? this.io.to(id).emit(eventName, payload) : this.io.to(id).emit(eventName)));
    };

    /**
     * Get the client id by value (socket id)
     * @param socketId Socket id value
     */
    getClientId = (socketId: string) => {
        return Object.keys(this.clients).find(uid => this.clients[uid] === socketId);
    };
}
