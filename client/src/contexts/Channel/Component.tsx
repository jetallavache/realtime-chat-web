import React, { useEffect, useReducer } from "react";

import { IChannelContextComponentProps } from "./interfaces";
import { ChannelContextProvider, ChannelReducer, defaultChannelContextState } from "./Context";
import { useSocketContext } from "../Socket/Context";
import { TMessageObject, TUserObject } from "@/config/interfaces";

const ChannelContextComponent: React.FunctionComponent<IChannelContextComponentProps> = props => {
    const { children } = props;

    const [ChannelState, ChannelDispatch] = useReducer(ChannelReducer, defaultChannelContextState);

    const { socket } = useSocketContext().SocketState;

    useEffect(() => {
        /** Start the event listeners */
        startListeners();
    }, []);

    const startListeners = () => {
        /** Get a list of members */
        socket?.on("receive_members", (members: TUserObject[]) => {
            // console.info("List of channel members has been received.");
            ChannelDispatch({ type: "update_members", payload: members });
        });

        /** Get a list of messages */
        socket?.on("receive_messages", (messages: TMessageObject[]) => {
            // console.info("List of channel messages has been received.");
            ChannelDispatch({ type: "update_messages", payload: messages });
        });

        /** Get one message */
        socket?.on("receive_message", (message: TMessageObject) => {
            // console.info("A new message has been added.");
            ChannelDispatch({ type: "add_message", payload: message });
        });
    };

    return <ChannelContextProvider value={{ ChannelState, ChannelDispatch }}>{children}</ChannelContextProvider>;
};

export default ChannelContextComponent;
