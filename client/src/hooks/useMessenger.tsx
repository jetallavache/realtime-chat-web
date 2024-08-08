import { useCallback, useEffect, useMemo } from "react";
import { useSocketContext } from "../contexts/Socket/Context";
import { TChannelObject, TUserObject } from "@/config/interfaces";
// import { useMessengerContext } from "@/contexts/Messenger/Context";

export const useMessenger = () => {
  const { socket } = useSocketContext().SocketState;

  // const { MessengerDispatch, MessengerState } = useMessengerContext();

  useEffect(() => {
    /** ЗДЕСЬ МОЖЕМ ДОБАВИТЬ СЛУШАТЕЛЕЙ КОТОРЫЕ ИНИЦИАЛИЗИРУЮТСЯ ВО ВРЕМЯ ВЫЗОВА ХУКА  */

    // socket?.on("receive_channels", (channels: TChannelObject[]) => {
    //   MessengerDispatch({ type: "update_channels", payload: channels })
    // });

    return () => {
      // socket?.off("create_channel");
      // socket?.off("remove_channel");
    };
  }, []);

  const updateChannelList = useCallback(async () => {
    socket?.emit("get_channels");
  }, []);

  const createChannel = useCallback(async (channel: TChannelObject) => {
    console.log(channel)
    socket?.emit("create_channel", channel);
  }, []);

  const removeChannel = useCallback(async (channel: TChannelObject) => {
    socket?.emit("remove_channel", channel);
  }, []);

  const updateUserList = useCallback(async () => {
    socket?.emit("get_users");
  }, []);

  // const createUser = useCallback(async (user: TUserObject) => {
  //   socket?.emit("create_user", user);
  // }, []);

  // const getUser = useCallback(async (userId: string) => {
  //   socket?.emit("get_user", userId);
  // }, []);

  const messengerActions = useMemo(
    () => ({
      updateChannelList,
      createChannel,
      removeChannel,
      updateUserList,
      // createUser,
      // getUser,
    }),
    [],
  );

  return { messengerActions };
};
