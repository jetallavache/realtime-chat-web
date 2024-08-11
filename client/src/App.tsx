import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import authProvider from "@/config/authProvider";
import config from "./config/constants";
import { useMessengerContext } from "./contexts/Messenger/Context";
import { createRoutesFrom } from "./router";
import Layout from "./layout/Layout";

const Routes = createRoutesFrom(import.meta.glob("./pages/**/*", { eager: true }));

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = _props => {
    const { MessengerDispatch } = useMessengerContext();
    const { checkUser } = authProvider(config.apiUrl);
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        const user = checkUser();

        if (user) {
            MessengerDispatch({ type: "update_user", payload: user.data });
            if (/^\/chat\/[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(currentPath))
                return;
            else navigate("/chat");
        } else {
            MessengerDispatch({ type: "update_user", payload: null });
            if (currentPath !== "/signup") {
                navigate("/login");
            }
        }
    }, []);

    return (
        <>
            <Layout>
                <Routes />
            </Layout>
        </>
    );
};

export default App;
