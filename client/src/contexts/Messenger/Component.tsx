import React, { useReducer } from "react";

import { IMessengerContextComponentProps } from "./interfaces";
import { defaultMessengerContextState, MessengerContextProvider, MessengerReducer } from "./Context";

const MessengerContextComponent: React.FunctionComponent<IMessengerContextComponentProps> = props => {
    const { children } = props;
    const [MessengerState, MessengerDispatch] = useReducer(MessengerReducer, defaultMessengerContextState);

    return (
        <MessengerContextProvider value={{ MessengerState, MessengerDispatch }}>{children}</MessengerContextProvider>
    );
};

export default MessengerContextComponent;
