import { useCallback, useEffect, useMemo } from "react";
import { useSocketContext } from "../contexts/Socket/Context";
import { TMessageObject } from "@/config/interfaces"

export const useChannel = (channelId: string) => {
  const { socket } = useSocketContext().SocketState;

  useEffect(() => {

    return () => {

    };
  }, []);

  const joinRoom = useCallback(() => {
    socket?.emit("join_room", channelId);
  }, []);

  const leaveRoom = useCallback(() => {
    socket?.emit("leave_room", channelId);
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
      sendMessage,
      updateMessage,
      removeMessage,
    }),
    [],
  );

  return { channelActions };
};
