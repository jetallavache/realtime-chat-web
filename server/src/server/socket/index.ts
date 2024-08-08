import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

import { corsOptions } from '../utils/cors.options';
import messengerHandlers from '../../ws/messenger';
import channelHandlers from '../../ws/channel';
import appService from './app.service';
import { TUser, TMessage, TChannel } from './interfaces';

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
            const reconnected = this._getByValue(this.clients, socket.id) ? true : false;

            if (reconnected) {
                console.info('This user has reconnected.');

                let clientId = this._getByValue(this.clients, socket.id);
                let clients = [...this.clients.values()];

                if (clientId && userId && clientId !== userId) {
                    console.info("Changed the client id to the id of an authorized user.");
                    this.clients.delete(clientId);
                    this.clients.set(userId, socket.id);
                    
                    clientId = this._getByValue(this.clients, socket.id);
                    clients = [...this.clients.values()];
                }

                if (clientId) {
                    console.info('Sending callback for reconnect ...');
                    callback(clientId, clients);
                    return;
                }
            }

            const clientId = v4();
            this.clients.set(clientId, socket.id);

            const clients = [...this.clients.values()];
            console.info('Sending callback ...');
            callback(clientId, clients);
            

            this.sendMessage(
                'client_connected',
                clients.filter(id => id !== socket.id),
                clients,
            );

            console.log(this.clients);
        });

        socket.on('disconnect', () => {
            console.info('Disconnect received from: ' + socket.id);
            const clientId = this._getByValue(this.clients, socket.id);

            if (clientId) {
                this.clients.delete(clientId);
                const clients = [...this.clients.values()];
                this.sendMessage('client_disconnected', clients, socket.id);
            }
        });

        messengerHandlers({ io: this.io, socket, clients: this.clients });

        channelHandlers({ io: this.io, socket, clients: this.clients });
    };

    /**
     * Send a message through socket
     * @param nameEvent The name of the event, ex: handshake
     * @param users List of socket id's
     * @param payload Any info needed by the user for state updates
     */
    sendMessage = (eventName: string, clients: string[], payload?: Object) => {
        console.info("Emitting event '" + eventName + "', - to ", clients, ', - payload ', payload);
        clients.forEach(id => (payload ? this.io.to(id).emit(eventName, payload) : this.io.to(id).emit(eventName)));
    };

    _getByValue = (map: Map<string, string>, searchValue: string) => {
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
