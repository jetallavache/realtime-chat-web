import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import SocketContextComponent from "./contexts/Socket/Component.tsx";
import MessengerContextComponent from "./contexts/Messenger/Component.tsx";
import ChannelContextComponent from "@/contexts/Channel/Component";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <SocketContextComponent>
        <MessengerContextComponent>
          {/* <ChannelContextComponent> */}

            <BrowserRouter>
                  <App />
            </BrowserRouter>
          {/* </ChannelContextComponent> */}
        </MessengerContextComponent>
      </SocketContextComponent>
  </React.StrictMode>,
);
