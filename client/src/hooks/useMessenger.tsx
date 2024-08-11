import { useCallback, useEffect, useMemo } from "react";
import { useSocketContext } from "../contexts/Socket/Context";
import { TChannelObject, TUserObject } from "@/config/interfaces";
import { useMessengerContext } from "@/contexts/Messenger/Context";

export const useMessenger = () => {
    const { socket } = useSocketContext().SocketState;
    const { MessengerDispatch } = useMessengerContext();

    useEffect(() => {
        /** Get a list of channels */
        socket?.on("receive_channels", (channels: TChannelObject[]) => {
            console.info("List of channels has been received.");
            MessengerDispatch({ type: "update_channels", payload: channels });
        });

        /** Get a list of users */
        socket?.on("receive_users", (users: TUserObject[]) => {
            console.info("List of users has been received");
            MessengerDispatch({ type: "update_users", payload: users });
        });

        return () => {
            socket?.off("receive_channels");
            socket?.off("receive_users");
        };
    });

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

    const exit = useCallback(async (userId: string | undefined) => {
        socket?.emit("exit", userId);
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
