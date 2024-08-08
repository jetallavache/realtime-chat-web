import ChannelContextComponent from "@/contexts/Channel/Component";
import Channel from "./Channel";

const ChatScreen = () => {
  return (
    <ChannelContextComponent>
      <Channel />
    </ChannelContextComponent>
  );
};

export default ChatScreen;
