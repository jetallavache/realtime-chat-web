import serviceMessenger from './channel.sevice';
import onError from '../../server/socket/error.socket';
import { ConnectionType, TMessage } from '../../server/socket/interfaces';
import z from 'zod';

export default ({ io, socket, clients }: ConnectionType): void => {
    const updateMemberList = async (channelId: string) => {
        const members = await serviceMessenger.getMembers(channelId);
        eventEmitter('receive_members', channelId, members);
    };

    const updateMessageList = async (channelId: string) => {
        const messages = await serviceMessenger.getMessages(channelId);
        eventEmitter('receive_messages', channelId, messages);
    };

    const sendMessage = async (channelId: string, message: TMessage) => {
        eventEmitter('receive_message', channelId, message);
    };

    const eventEmitter = (eventName: string, roomId: string, payload?: Object) => {
        console.info("Emitting event '" + eventName + "', - to ", clients, ', - payload ', payload);
        // clients?.forEach((id) => (payload ? io.in(roomId).to(id).emit(eventName, payload) : io.in(roomId).to(id).emit(eventName)));
        io.in(roomId).emit(eventName, payload);
    };

    socket.on('join_room', async (channelId: string, userId: string) => {
        try {
            await socket.join(channelId);
            await serviceMessenger.addUserToChannel(channelId, userId);
            await updateMessageList(channelId);
            await updateMemberList(channelId);
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('leave_room', async (channelId: string, userId: string) => {
        try {
            await socket.leave(channelId);
            await serviceMessenger.excludeUserFromChannel(channelId, userId);
            await updateMemberList(channelId);
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('exclusion', async (channelId: string, memberId: string) => {
        try {
            await serviceMessenger.excludeUserFromChannel(channelId, memberId);
            const excSocketId = clients?.get(memberId);
            excSocketId && io.to(excSocketId).emit('called_exit');
            await updateMemberList(channelId);
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('send_message', async (channelId: string, message: TMessage) => {
        try {
            console.log('add new message, - room: ', channelId, ', - message: ', message);

            const objectSchema = z.object({
                from: z.string().trim().uuid(),
                to: z.string().trim().uuid(),
                content: z.string().max(300),
                timestamp: z.string().datetime({ offset: true }),
            });

            const _message = objectSchema.parse(message);

            await serviceMessenger.saveMessage(channelId, _message);
            await updateMessageList(channelId);
        } catch (error: any) {
            onError(error);
        }
    });
};
