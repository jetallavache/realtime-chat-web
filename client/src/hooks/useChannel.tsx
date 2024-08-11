import { useCallback, useEffect, useMemo } from "react";
import { useSocketContext } from "../contexts/Socket/Context";
import { TMessageObject } from "@/config/interfaces";
import { useNavigate } from "react-router-dom";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useToast } from "@/components/ui/use-toast";
import { useMessenger } from "./useMessenger";

export const useChannel = (channelId: string) => {
    const { socket } = useSocketContext().SocketState;
    const { user } = useMessengerContext().MessengerState;
    const { messengerActions } = useMessenger();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        socket?.on("called_exit", (memberId: string) => {
            if (user?.uid === memberId) {
                console.info("I was kicked out of the channel(.");
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "You were excluded from the chat by its owner.",
                });
                navigate("/chat");
            } else {
                console.info("I was not touched)))");
            }
        });

        return () => {
            socket?.off("called_exit");
        };
    }, []);

    const joinRoom = useCallback((userId: string) => {
        socket?.emit("join_room", channelId, userId);
        messengerActions.updateChannelList();
    }, []);

    const leaveRoom = useCallback((userId: string) => {
        socket?.emit("leave_room", channelId, userId);
        messengerActions.updateChannelList();
    }, []);

    const memberExclusion = useCallback((memberId: string) => {
        socket?.emit("exclusion", channelId, memberId);
    }, []);

    const sendMessage = useCallback((message: TMessageObject) => {
        socket?.emit("send_message", channelId, message);
    }, []);

    const updateMessage = useCallback((payload: any) => {
        socket?.emit("put_message", channelId, payload);
    }, []);

    const removeMessage = useCallback((payload: any) => {
        socket?.emit("delete_message", channelId, payload);
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
