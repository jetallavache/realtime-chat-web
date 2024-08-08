import channelModel from '../../mongo/models/channel.model';
import userModel from '../../mongo/models/user.model';

import { v4 } from 'uuid';

// async function incId() {
//     const maxId = await channelModel.findOne({}, '-_id id').sort({ id: -1 });

//     return !maxId ? 0 : maxId.id + 1;
// }

export default {
    async index() {
        const channels = await channelModel
            .find({}, '-_id id title description members messages countMembers')
            .populate('creator', '-_id uid username')
            .sort({ createdAt: -1 });

        return [channels.length, channels];
    },

    async create(data: { title: string; description?: string | undefined; creatorUid: string }) {
        const user = await userModel.findOne({ uid: data.creatorUid });

        const doc = new channelModel({
            id: v4(),
            title: data.title,
            description: data?.description ? data.description : '',
            creator: user?._id,
        });

        const newChannel = await doc.save();

        return newChannel;
    },

    async show(params: { id: string }) {
        return await channelModel
            .findOne({ id: params.id }, '-_id id title description countMembers')
            .populate('creator', '-_id uid username online')
            .populate('members', '-_id uid username online')
            .populate({
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
                        select: '-_id id title description countMembersid',
                    },
                ],
            })
    },
};
