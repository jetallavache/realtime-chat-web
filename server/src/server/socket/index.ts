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
    public clients: Map<string, string>;

    constructor(server: HTTPServer) {
        ServerSocket.instance = this;
        this.clients = new Map();

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
            const reconnected = this.getByValue(this.clients, socket.id) ? true : false;

            if (reconnected) {
                console.info('This client has reconnected.');

                let clientId = this.getByValue(this.clients, socket.id);
                let clients = [...this.clients.values()];

                if (clientId && userId && clientId !== userId) {
                    console.info('Changed the client id to the id of an authorized user.');
                    this.clients.delete(clientId);
                    this.clients.set(userId, socket.id);

                    clientId = this.getByValue(this.clients, socket.id);
                    clients = [...this.clients.values()];
                }

                if (clientId) {
                    console.info('Sending callback for reconnect ...');
                    callback(clientId, clients);
                    console.info(this.clients);
                    return;
                }
            } else {
                console.info('This new client.');
            }

            const clientId = v4();
            this.clients.set(clientId, socket.id);

            const clients = [...this.clients.values()];
            console.info('Sending callback ...');
            callback(clientId, clients);

            this.eventEmmiter(
                'client_connected',
                clients.filter(id => id !== socket.id),
                clients,
            );

            console.info(this.clients);
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
            const clientId = this.getByValue(this.clients, socket.id);

            if (clientId) {
                this.clients.delete(clientId);
                const clients = [...this.clients.values()];
                this.eventEmmiter('client_disconnected', clients, socket.id);
            }
        });

        messengerHandlers({ io: this.io, socket, clients: this.clients });

        channelHandlers({ io: this.io, socket, clients: this.clients });

        console.log(this.clients);
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
     * Get the key of Map by value
     * @param map Collection of connected clients
     * @param searchValue Socket id value
     */
    getByValue = (map: Map<string, string>, searchValue: string) => {
        let findKey;
        for (let [key, value] of map.entries()) {
            if (value === searchValue) {
                findKey = key;
            } else {
                findKey = null;
            }
        }

        return findKey;
    };
}
