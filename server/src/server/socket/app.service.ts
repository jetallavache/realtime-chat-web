import { v4 } from 'uuid';
import channelModel from '../../mongo/models/channel.model';
import { TUser, TMessage, TChannel } from './interfaces';
import userModel from '../../mongo/models/user.model';
import messageModel from '../../mongo/models/message.model';

export default {
    async getMessagesFromChannel(channelId: string) {
        const channel = await channelModel
            .findOne({ id: channelId }, '-_id id')
            // .populate('messages', '-_id content user channel createdAt') //'-_id content user channel'
            .populate({
                path: 'messages',
                select: '-_id id content createdAt',
                // Get friends of friends - populate the 'friends' array for every friend
                populate: { 
                    path: 'user',
                    select: '-_id uid username',
                }
              });

        return channel?.messages ? channel.messages : [];
    },
    async getMembersFromChannel(channelId: string) {
        const channel = await channelModel
            .findOne({ id: channelId }, '-_id id')
            .populate({
                path: 'members',
                select: '-_id uid username',
              });

        return channel?.members ? channel.members : [];
    },
    async saveMessage(channelId: string, message: TMessage) {

        const user = await userModel.findOne({ uid: message.from }, '_id');

        const doc = new messageModel({
            id: v4(),
            content: message.content,
            user: user?._id,
        });

        const newMessage = await doc.save();

        await channelModel.updateOne(
            {
                id: channelId,
            },
            {
                $push:
                {
                    messages: doc, 
                },
            }
        );

        return newMessage;
    },
    async addUserToChannel(room: string, uid: string) {

        const user = await userModel.findOne({ uid: uid }, '_id');

        await channelModel.updateOne(
            {
                id: room,
            },
            {
                $push:
                {
                    members: user?._id, 
                },
            }
        );
    },
    async getUser(uid: string | undefined) {

        const user = await userModel.findOne({ uid: uid }, '_id uid name');

        return user;
    },
    async getChannels() {
        const channels = await channelModel
            .find({}, '-_id id title description countMembers')
            .populate({
                path: 'creator',
                select: '-_id uid name',
              })
            .populate({
                path: 'messages',
                select: '-_id id content channel createdAt',
                populate: { 
                    path: 'user',
                    select: '-_id uid name',
                }
              })
            .populate({
                path: 'members',
                select: '-_id uid name',
              });

        return channels;
    },
    async saveChannel(uid: string, channel: TChannel) {

        console.log(channel.creator)

        let user = await userModel.findOne({ uid: uid })

        const doc = new channelModel({
            id: channel.id ? channel.id : v4(),
            title: channel.title,
            description: channel?.description ? channel.description : "",
            creator: user?._id,
            members: channel?.members,
            messages: channel?.messages,
            countMembers: channel?.countMembers,
        });

        const newChannel = await doc.save();

        return newChannel;
    },
};

