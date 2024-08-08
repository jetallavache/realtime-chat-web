import { useChannel } from "@/hooks/useChannel";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useChannelContext } from "@/contexts/Channel/Context";
import config from '@/config/constants';
import { Chat } from "./Chat";
import dataProvider from "@/config/dataProvider";
import { TUserObject } from "@/config/interfaces";
import { useSocketContext } from "@/contexts/Socket/Context";

const resource = "channels";

const Channel = () => {
  let { id } = useParams();
  const { ChannelDispatch } = useChannelContext();
  const { MessengerDispatch } = useMessengerContext();
  const { user } = useMessengerContext().MessengerState;
  const { messages, members } = useChannelContext().ChannelState;
  const { channelActions } = useChannel(id ? id : "");
  const { getOne } = dataProvider(config.apiUrl);
  const [hasOwner, setHasOwner] = useState<boolean>(false);

  useEffect(() => {
    console.log("cмонтирован useeffect");
    id && channelActions.joinRoom(user?.uid ? user.uid : "");
    id && fetch(resource, id);

  }, [id]);

  console.log(members)

  useEffect(() => {
    return () => {
      console.log("размонтирован useeffect");
      ChannelDispatch({ type: "update_members", payload: [] });
      ChannelDispatch({ type: "update_messages", payload: [] });
      ChannelDispatch({ type: "update_channel", payload: {} });
      channelActions.leaveRoom(user?.uid ? user.uid : "");
    };
  }, []);

  async function fetch(resource: string, channelId : string) {
    try {
      getOne(resource, { id: channelId })
        .then((result) => {
          MessengerDispatch({ type: "update_channel", payload: result.data });
          return result.data;
        })
        .then((channel) => {
          (channel?.creator.uid === user?.uid) ? setHasOwner(true) : setHasOwner(false);
          return channel;
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function memberExclusionHandler(member: TUserObject) {
    member.uid && channelActions.memberExclusion(member.uid);
  }

  return (
    <div className="">
      {id && (
        <Chat
          channelId={id}
          userUid={user?.uid}
          messages={messages ? messages : []}
          members={members ? members : []}
          isOwner={hasOwner}
          excludeMember={memberExclusionHandler}
          navCollapsedSize={4}
        />
      )}
    </div>
  );
};

export default Channel;
