import { useChannel } from "@/hooks/useChannel";
import { useParams } from "react-router-dom";

import { useSocketContext } from "@/contexts/Socket/Context";
import { useEffect } from "react";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useChannelContext } from "@/contexts/Channel/Context";
import { Chat } from "./Chat";

const Channel = () => {
    let { id } = useParams();
    const { clientId } = useSocketContext().SocketState;
    const { ChannelDispatch } = useChannelContext()
    const { user } = useMessengerContext().MessengerState;
    const { messages } = useChannelContext().ChannelState;
    const { channelActions } = useChannel(id ? id : "");
  
    useEffect(() => {
      console.log("cмонтирован useeffect")
      id && channelActions.joinRoom();
    }, [id]);
    
    useEffect(() => {
      return ()=> {
        console.log("размонтирован useeffect")
        ChannelDispatch({ type: "update_members", payload: [] });
        ChannelDispatch({ type: "update_messages", payload: [] });
        ChannelDispatch({ type: "update_channel", payload: {} });
        channelActions.leaveRoom();
      }
    }, []);

    return (
      <div className="">
        {id && (
          <Chat
            channelId={id}
            userUid={clientId}
            messages={messages ? messages : []}
            users={[]}
            navCollapsedSize={4}
          />
        )}
      </div>
    );
};

export default Channel;
