import channelModel from '../../mongo/models/channel.model';
import userModel from '../../mongo/models/user.model';
import messageModel from '../../mongo/models/message.model';
import { TChannel, TMessage, TUser } from '../../server/socket/interfaces';
import { v4 } from 'uuid';

export default {
    async getMessages(channelId: string) {
        const channel = await channelModel.findOne({ id: channelId }, '-_id id').populate({
            path: 'messages',
            select: '-_id id content timestamp',
            // Get friends of friends - populate the 'friends' array for every friend
            populate: [
                {
                    path: 'from',
                    select: '-_id uid username online',
                },
                {
                    path: 'to',
                    select: '-_id id title description ',
                },
            ],
        });

        return channel?.messages ? channel.messages : [];
    },

    async getMembers(channelId: string) {
        const channel = await channelModel.findOne({ id: channelId }, '-_id id').populate({
            path: 'members',
            select: '-_id uid username online',
        });

        return channel?.members ? channel.members : [];
    },

    async saveMessage(channelId: string, message: TMessage) {
        const userId = message.from
            ? (<TUser>message.from).uid
                ? (<TUser>message.from).uid
                : <string>message.from
            : null;

        const user = await userModel.findOne({ uid: userId }, '_id');
        const channel = await channelModel.findOne({ id: channelId }, '_id');

        const doc = new messageModel({
            id: v4(),
            from: user?._id,
            to: channel?._id,
            content: message.content,
            timestamp: message.timestamp,
        });

        const newMessage = await doc.save();
        await channelModel.updateOne(
            {
                id: channelId,
            },
            {
                $push: {
                    messages: doc,
                },
            },
        );

        return newMessage;
    },

    async addUserToChannel(channelId: string, userId: string) {
        const user = await userModel.findOne({ uid: userId }, '_id');

        user?._id &&
            (await channelModel.findOneAndUpdate(
                {
                    id: channelId,
                },
                {
                    $addToSet: {
                        members: user._id,
                    },
                },
            ));
    },

    async excludeUserFromChannel(channelId: string, userId: string) {
        const user = await userModel.findOne({ uid: userId }, '_id');

        user?._id &&
            (await channelModel.findOneAndUpdate(
                {
                    id: channelId,
                },
                {
                    $pull: {
                        members: user._id,
                    },
                },
            ));
    },
};
