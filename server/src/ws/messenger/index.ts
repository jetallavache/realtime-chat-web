import serviceMessenger from './messenger.sevice';
import onError from '../../server/socket/error.socket';
import { ConnectionType, TChannel, TUser } from '../../server/socket/interfaces';

export default ({ io, socket, clients }: ConnectionType): void => {
    console.log('Messenger');

    const updateChannelList = async () => {
        const channels = await serviceMessenger.getAllChannels();
        eventEmitter('receive_channels', channels);
    };

    const updateUserList = async () => {
        const users = await serviceMessenger.getAllUsers();
        eventEmitter('receive_users', users);
    };

    const eventEmitter = (eventName: string, payload?: Object) => {
        console.info("Emitting event '" + eventName + "', - to ", clients, ', - payload ', payload);
        clients?.forEach(id => (payload ? io.to(id).emit(eventName, payload) : io.to(id).emit(eventName)));
    };

    socket.on('get_channels', async () => {
        try {
            updateChannelList();
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('create_channel', async (channel: TChannel) => {
        try {
            await serviceMessenger.createChannel(channel);
            updateChannelList();
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('remove_channel', async (channelId: string) => {
        try {
            await serviceMessenger.removeChannel(channelId);
            updateChannelList();
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('get_users', async () => {
        try {
            updateUserList();
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('create_user', async (user: TUser) => {
        try {
            await serviceMessenger.createUser(user);
            updateUserList();
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('get_user', async (userId: string) => {
        try {
            await serviceMessenger.getUser(userId);
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('exit', async (clientId: string) => {
        try {
            console.info('Delete client from array: -', clientId, clients?.has(clientId));
            clients?.has(clientId) && clients.delete(clientId);
        } catch (error: any) {
            onError(error);
        }
    });
};
