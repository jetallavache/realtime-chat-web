import React from "react";

import { CreateChannel } from "./CreateChannel";
import { ListChannels } from "./ListChannels";
import ChannelsContextComponent from "@/contexts/Messenger/Component";
import { ListUsers } from "./ListUsers";

const EditChannelsScreen: React.FC = () => {
  return (
    <ChannelsContextComponent>
      <div className="container flex-row sm:flex sm:w-screen bg-zinc-50">
        <div className="m-2">
          <CreateChannel />
        </div>
        <div className="m-2">
          <ListChannels />
        </div>
        <div className="m-2">
          <ListUsers />
        </div>
      </div>
    </ChannelsContextComponent>
  );
};

export default EditChannelsScreen;
