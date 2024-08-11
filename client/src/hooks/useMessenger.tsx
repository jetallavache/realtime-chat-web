import { useCallback, useMemo } from "react";
import { useSocketContext } from "../contexts/Socket/Context";
import { TChannelObject } from "@/config/interfaces";

export const useMessenger = () => {
    const { socket } = useSocketContext().SocketState;

    const updateChannelList = useCallback(async () => {
        socket?.emit("get_channels");
    }, []);

    const createChannel = useCallback(async (channel: TChannelObject) => {
        socket?.emit("create_channel", channel);
    }, []);

    const removeChannel = useCallback(async (channel: TChannelObject) => {
        socket?.emit("remove_channel", channel);
    }, []);

    const updateUserList = useCallback(async () => {
        socket?.emit("get_users");
    }, []);

    const exit = useCallback(async (clientId: string | undefined) => {
        socket?.emit("exit", clientId);
    }, []);

    const messengerActions = useMemo(
        () => ({
            updateChannelList,
            createChannel,
            removeChannel,
            updateUserList,
            exit,
        }),
        [],
    );

    return { messengerActions };
};
