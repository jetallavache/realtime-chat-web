import { createContext, useContext } from "react";
import { IMessengerContextAction, IMessengerContextProps, IMessengerContextState } from "./interfaces";
import { TChannelObject, TUserObject } from "@/config/interfaces";

export const defaultMessengerContextState: IMessengerContextState = {
    user: null,
    channel: null,
    users: [],
    channels: [],
};

export const MessengerReducer = (state: IMessengerContextState, action: IMessengerContextAction) => {
    console.log(`Messenger context. Message received, - Action: ${action.type}, - Payload: `, action.payload);

    switch (action.type) {
        case "update_user":
            return { ...state, user: action.payload as TUserObject };

        case "update_channel":
            return { ...state, channel: action.payload as TChannelObject };

        case "update_channels":
            return { ...state, channels: action.payload as TChannelObject[] };

        case "add_channel":
            return {
                ...state,
                channels: state.channels?.concat(action.payload as TChannelObject),
            };

        /** by channel id */
        case "remove_channel":
            return {
                ...state,
                channels: state.channels?.filter(channel => channel.id != (action.payload as string)),
            };

        case "update_users":
            return { ...state, users: action.payload as TUserObject[] };

        case "add_user":
            return {
                ...state,
                users: state.users?.concat(action.payload as TUserObject),
            };

        // /** by user uid */
        case "remove_user":
            return {
                ...state,
                users: state.users?.filter(user => user.uid != (action.payload as string)),
            };

        default:
            return { ...state };
    }
};

const MessengerContext = createContext<IMessengerContextProps>({
    MessengerState: defaultMessengerContextState,
    MessengerDispatch: () => {},
});

export const useMessengerContext = () => useContext(MessengerContext);

export const MessengerContextConsumer = MessengerContext.Consumer;
export const MessengerContextProvider = MessengerContext.Provider;

export default MessengerContext;
