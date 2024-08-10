import React from "react";

import { CreateChannel } from "./CreateChannel";
import { ChannelList } from "./ChannelList";
import ChannelsContextComponent from "@/contexts/Messenger/Component";
import { UserList } from "./UserList";

const EditChannelsScreen: React.FC = () => {
  return (
    <ChannelsContextComponent>
      <div className="container flex-row gap-4 sm:flex sm:w-screen">
        <div className="my-2">
          <CreateChannel />
        </div>
        <div className="my-2">
          <ChannelList />
        </div>
        <div className="my-2">
          <UserList />
        </div>
      </div>
    </ChannelsContextComponent>
  );
};

export default EditChannelsScreen;
