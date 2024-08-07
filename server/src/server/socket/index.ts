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

        socket.on('handshake', async (callback: (clientId: string, clients: string[]) => void) => {
            console.info('Handshake received from: ' + socket.id);
            const reconnected = this._getByValue(this.clients, socket.id) ? true : false;

            if (reconnected) {
                console.info('This user has reconnected.');

                const clientId = this._getByValue(this.clients, socket.id);
                const clients = [...this.clients.values()];

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
                clients.filter((id) => id !== socket.id),
                clients
            );
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

        console.log("handshake",socket.rooms)


        messengerHandlers({ io: this.io, socket, clients: this.clients });

        channelHandlers({ io: this.io, socket, clients: this.clients });

        console.log(socket.rooms)
        // socket.on("create_channel", async (uid: string, newChannel: TChannel, callback: ((channel : TChannel) => void)) => {
        //     // const readded = this.channels.has(uid);

        //     // if (readded) {
        //     //     return;

        //     // }

        //     const { id: selfId, creator: c, countMembers, ...data } = newChannel;
            
        //     const { id } = await appService.saveChannel(uid, newChannel);

            
        //     const creator = await appService.getUser(uid);

        //     this.channels.set(uid, {id: id, creator: creator?.username, countMembers: 0, ...data});
            
        //     callback({id: id, creator: creator?.username, countMembers: 0, ...data});

        //     const users = this.GetArrayFromMap(this.clients)

        //     // console.log("ALL USERS", users)

        //     // console.log("PART USERS", users.filter((item) => item.socketId !== socket.id))

        //     // console.log('MY SOCKET ID: ', socket.id)

        //     this.SendMessage(
        //         'channel_created',
        //         users.filter((item) => item.socketId !== socket.id),
        //         {id: id, creator: creator?.username, countMembers: 0, ...data}
        //     );

        //     // socket.broadcast.emit('channel_created', {id: id, creator: creator?.name, countMembers: 0, ...data})
        // });

        // socket.on('join_room', async ({channelId, username, uid} : {channelId: string, username: string, uid: string}) => {
        //     console.log("Join Room: ", channelId, " user: ", username);
            
        //     await socket.join(channelId);
            
        //     await appService.addUserToChannel(channelId, uid);
            
        //     // await this.HandleMessagesGet(channelId);
        //     // await this.HandleChannelsGet();
            
        //     let __createdtime__ = Date.now(); // Current timestamp
            
        //     /** Send message to all users currently in the room, apart from the user that just joined */
        //     this.io.in(channelId).emit('receive_message', {
        //         message: `${username} joined the channel.`,
        //         created: __createdtime__,
        //     });

        // });

        // socket.on('get_messages', async (channelId : string, callaback : (messages : any) => void) => {
        //     const _messages = await appService.getMessagesFromChannel(channelId); 
        //     console.log(_messages)
        //     callaback(_messages);
        // });

        // socket.on('get_users', async (channelId : string, callaback : (users : any) => void) => {
        //     const _members = await appService.getMembersFromChannel(channelId); 
        //     callaback(_members);
        // });

        // socket.on('send_message', async (channelId: string, message: TMessage) => {
        //     console.log("Emit: messages_add - in: ", channelId, ", - message: ", message);
            
        //     await socket.join(channelId);
        //     await appService.saveMessage(channelId, message);
            
        //     /** Send everyone in the chat */
        //     // await this.HandleMessagesGet(channelId);

        //     this.io.in(channelId).emit("forward_message", message);
            
        //     // this.io.in(channelId).emit("messages_add", message);
            
        // });

        
    };

    /**
     * Send a message through socket
     * @param nameEvent The name of the event, ex: handshake
     * @param users List of socket id's
     * @param payload Any info needed by the user for state updates
     */
    sendMessage = (eventName: string, clients: string[], payload?: Object) => {
        console.info('Emitting event \'' + eventName + '\', - to ', clients, ', - payload ', payload);
        clients.forEach((id) => (payload ? this.io.to(id).emit(eventName, payload) : this.io.to(id).emit(eventName)));
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
    }
}
