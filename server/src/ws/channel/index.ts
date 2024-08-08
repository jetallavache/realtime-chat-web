import serviceMessenger from './channel.sevice';
import onError from '../../server/socket/error.socket';
import { ConnectionType, TChannel, TMessage, TUser } from '../../server/socket/interfaces';
import z from 'zod';
import { format } from 'path';

export default ({ io, socket, clients }: ConnectionType): void => {
    const updateMemberList = async (channelId: string) => {
        const members = await serviceMessenger.getMembers(channelId);
        sendMessage('receive_members', channelId, members);
    };

    const updateMessageList = async (channelId: string) => {
        const messages = await serviceMessenger.getMessages(channelId);
        sendMessage('receive_messages', channelId, messages);
    };

    const sendMessage = (eventName: string, roomId: string, payload?: Object) => {
        // console.info('Emitting event \'' + eventName + '\', - to ', clients, ', - payload ', payload);
        // clients?.forEach((id) => (payload ? io.in(roomId).to(id).emit(eventName, payload) : io.in(roomId).to(id).emit(eventName)));
        io.in(roomId).emit(eventName, payload);
    };

    socket.on('join_room', async (channelId: string, userId: string) => {
        try {
            await serviceMessenger.addUserToChannel(channelId, userId);
            await socket.join(channelId);

            await updateMessageList(channelId);
            await updateMemberList(channelId);
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('leave_room', async (channelId: string, userId: string) => {
        try {
            await serviceMessenger.excludeUserFromChannel(channelId, userId);
            await socket.leave(channelId);
            await updateMemberList(channelId);
        } catch (error: any) {
            onError(error);
        }
    });

    socket.on('exclusion', async (channelId: string, memberId: string) => {
        try {
            await serviceMessenger.excludeUserFromChannel(channelId, memberId);
            
            // await socket.leave(channelId);
            console.log("ALL CLIENTS: ", clients);
            console.log("EXCLUSION MEMBER ID: ", memberId);

            const excSocketId = clients?.get(memberId);

            excSocketId && io.to(excSocketId).emit('called_exit', memberId);
            
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
