import { useChannel } from "@/hooks/useChannel";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useMessengerContext } from "@/contexts/Messenger/Context";
import { useChannelContext } from "@/contexts/Channel/Context";
import config from "@/config/constants";
import { Chat } from "./Chat";
import dataProvider from "@/config/dataProvider";
import { TUserObject } from "@/config/interfaces";

const resource = "channels";

const Channel = () => {
    let { id } = useParams();
    const { ChannelDispatch } = useChannelContext();
    const { MessengerDispatch } = useMessengerContext();
    const { user, channels } = useMessengerContext().MessengerState;
    const { messages, members } = useChannelContext().ChannelState;
    const { channelActions } = useChannel(id ? id : "");
    const { getOne } = dataProvider(config.apiUrl);
    const [hasOwner, setHasOwner] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            console.log("AAAAAAAAAAAAAAAAAA", id);
            channelActions.joinRoom(user?.uid ? user.uid : "");

            setTimeout(() => {
                channelActions.joinRoom(user?.uid ? user.uid : "");
            }, 1000);

            fetch(resource, id);
        }

        return () => {
            ChannelDispatch({ type: "update_members", payload: [] });
            ChannelDispatch({ type: "update_messages", payload: [] });
            ChannelDispatch({ type: "update_channel", payload: {} });
            if (id && user?.uid) {
                console.log("BBBBBBBBBBBB", id);
                channelActions.leaveRoom(user.uid ? user.uid : "");

                setTimeout(() => {
                    channelActions.leaveRoom(user.uid ? user.uid : "");
                }, 1000);
            }
        };
    }, [id]);

    async function fetch(resource: string, channelId: string) {
        try {
            getOne(resource, { id: channelId })
                .then(result => {
                    MessengerDispatch({ type: "update_channel", payload: result.data });
                    return result.data;
                })
                .then(channel => {
                    channel?.creator.uid === user?.uid ? setHasOwner(true) : setHasOwner(false);
                    return channel;
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    function memberExclusionHandler(member: TUserObject) {
        member.uid && channelActions.memberExclusion(member.uid); /** ПЕРЕДАЕМ СОКЕТ ID УЧАСТНИКА */
    }

    return (
        <>
            {id && (
                <Chat
                    channelId={id}
                    userUid={user?.uid}
                    messages={messages ? messages : []}
                    members={members ? members : []}
                    channels={channels}
                    isOwner={hasOwner}
                    excludeMember={memberExclusionHandler}
                    navCollapsedSize={4}
                />
            )}
        </>
    );
};

export default Channel;
