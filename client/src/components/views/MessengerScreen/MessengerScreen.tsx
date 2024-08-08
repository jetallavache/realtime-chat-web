import React from "react";

import { CreateChannel } from "./CreateChannel";
import { ChannelList } from "./ChannelList";
import ChannelsContextComponent from "@/contexts/Messenger/Component";
import { UserList } from "./UserList";

const EditChannelsScreen: React.FC = () => {
  return (
    <ChannelsContextComponent>
      <div className="container flex-row sm:flex sm:w-screen bg-zinc-50">
        <div className="m-2">
          <CreateChannel />
        </div>
        <div className="m-2">
          <ChannelList />
        </div>
        <div className="m-2">
          <UserList />
        </div>
      </div>
    </ChannelsContextComponent>
  );
};

export default EditChannelsScreen;
