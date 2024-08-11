import { createContext, useContext } from 'react';
import { IChannelContextAction, IChannelContextProps, IChannelContextState } from './interfaces';
import { TChannelObject, TMessageObject, TUserObject } from '@/config/interfaces';

export const defaultChannelContextState: IChannelContextState = {
    channel: {
        id: '',
        title: '',
        description: '',
        creator: '',
        members: [],
        messages: [],
        countMembers: 0,
    },
    owner: {
        uid: '',
        username: '',
    },
    members: [],
    messages: [],
};

export const ChannelReducer = (state: IChannelContextState, action: IChannelContextAction) => {
    console.log(`Message received - Action: ${action.type}, - Payload: `, action.payload);

    switch (action.type) {
        case 'update_channel':
            return { ...state, Channel: action.payload as TChannelObject };

        case 'update_owner':
            return { ...state, username: action.payload as TUserObject };

        case 'update_members':
            return { ...state, members: action.payload as TUserObject[] };

        case 'add_member':
            return {
                ...state,
                // members: state.members?.concat(action.payload as TUserObject),
                members: [...new Set(state.members?.concat(action.payload as TUserObject))],
            };

        /** by user uid */
        case 'remove_member':
            return {
                ...state,
                members: state.members?.filter(member => member.uid != (action.payload as string)),
            };

        case 'update_messages':
            return { ...state, messages: action.payload as TMessageObject[] };

        case 'add_message':
            return {
                ...state,
                // messages: state.messages?.concat(action.payload as TMessageObject),
                messages: [...new Set(state.messages?.concat(action.payload as TMessageObject))],
            };

        /** by message id */
        case 'remove_message':
            return {
                ...state,
                messages: state.messages?.filter(message => message.id != (action.payload as string)),
            };
        default:
            return { ...state };
    }
};

const ChannelContext = createContext<IChannelContextProps>({
    ChannelState: defaultChannelContextState,
    ChannelDispatch: () => {},
});

export const useChannelContext = () => useContext(ChannelContext);

export const ChannelContextConsumer = ChannelContext.Consumer;
export const ChannelContextProvider = ChannelContext.Provider;

export default ChannelContext;
