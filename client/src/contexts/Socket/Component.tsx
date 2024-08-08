import React, { useEffect, useReducer, useState } from "react";

import { ISocketContextComponentProps } from "./interfaces";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./Context";

import { useSocket } from "@/hooks/useSocket";
import config from "@/config/constants";
import { useMessengerContext } from "../Messenger/Context";

const { wsUrl } = config;

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState,
  );

  const [loading, setLoading] = useState(true);

  const socket = useSocket(wsUrl, {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
  });

  const { user } = useMessengerContext().MessengerState;

  console.log("AAAAAAAAAAAAAAAA", user)

  useEffect(() => {
    /** Connect to the Web Socket */
    socket.connect();
    console.info("Connect to ", wsUrl);

    /** Save the socket in context */
    SocketDispatch({ type: "update_socket", payload: socket });
    SocketDispatch({ type: "update_status", payload: "connected" });

    /** Start the event listeners */
    startListeners();

    /** Send the handshake */
    sendHandshake();
  }, [user]);

  const startListeners = () => {
    /** Messages */
    socket.on("client_connected", (clients: string[]) => {
      console.info("User connected message received");
      SocketDispatch({ type: "update_clients", payload: clients });
    });

    /** Messages */
    socket.on("client_disconnected", (clientId: string) => {
      console.info("User disconnected message received");
      SocketDispatch({ type: "remove_client", payload: clientId });
    });

    /** Reconnect event */
    socket.io.on("reconnect", (attempt) => {
      console.info("Reconnected on attempt: ", attempt);
      sendHandshake();
    });

    /** Reconnect attempt event */
    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("Reconnection attempt: ", attempt);
    });

    /** Reconnect errror */
    socket.io.on("reconnect_error", (error) => {
      console.info("Reconnect error: ", error);
    });

    /** Reconnect failed */
    socket.io.on("reconnect_failed", () => {
      console.info("Reconnection failure.");
      alert(
        "We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later.",
      );
    });
  };

  const sendHandshake = async () => {
    console.info("Sending handshake to server ...");

    socket.emit("handshake", user?.uid, (clientId: string, clients: string[]) => {
      console.info("User handshake callback message received.");
      SocketDispatch({ type: "update_clientId", payload: clientId });
      SocketDispatch({ type: "update_clients", payload: clients });

      setLoading(false);
    });
  };

  if (loading) return <p>Loading Socket IO ...</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
