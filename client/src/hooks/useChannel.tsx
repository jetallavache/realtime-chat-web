import { useCallback, useEffect, useMemo } from 'react';
import { useSocketContext } from '../contexts/Socket/Context';
import { TMessageObject } from '@/config/interfaces';
import { useNavigate } from 'react-router-dom';

export const useChannel = (channelId: string) => {
    const { socket } = useSocketContext().SocketState;
    const navigate = useNavigate();

    useEffect(() => {
        socket?.on('called_exit', () => {
            console.info('I was kicked out of the channel(.');
            navigate('/chat');
        });

        return () => {
            socket?.off('called_exit');
        };
    }, []);

    const joinRoom = useCallback((userId: string) => {
        socket?.emit('join_room', channelId, userId);
    }, []);

    const leaveRoom = useCallback((userId: string) => {
        socket?.emit('leave_room', channelId, userId);
    }, []);

    const memberExclusion = useCallback((memberId: string) => {
        socket?.emit('exclusion', channelId, memberId);
    }, []);

    const sendMessage = useCallback((message: TMessageObject) => {
        socket?.emit('send_message', channelId, message);
    }, []);

    const updateMessage = useCallback((payload: any) => {
        socket?.emit('put_message', channelId, payload);
    }, []);

    const removeMessage = useCallback((payload: any) => {
        socket?.emit('delete_message', channelId, payload);
    }, []);

    const channelActions = useMemo(
        () => ({
            joinRoom,
            leaveRoom,
            memberExclusion,
            sendMessage,
            updateMessage,
            removeMessage,
        }),
        [],
    );

    return { channelActions };
};
