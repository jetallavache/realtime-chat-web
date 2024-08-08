import userModel from '../../mongo/models/user.model';

export default {
    async index() {
        const users = await userModel.find({}, '-_id uid username');
        return [users.length, users];
    },

    async create(data: { uid: string; username: string }) {
        const doc = new userModel({
            uid: data.uid,
            username: data.username,
        });

        const newUser = await doc.save();

        return newUser;
    },

    async login(data: { uid: string }) {
        await userModel.findOneAndUpdate({ uid: data.uid }, { online: true });

        const user = await userModel.findOne({ uid: data.uid });

        return { uid: user?.uid, username: user?.username, online: user?.online };
    },

    async update(params: { id: string }, data: { uid?: string; username?: string; online?: boolean }) {
        await userModel.findOneAndUpdate(
            { uid: params.id },
            {
                uid: data?.uid,
                username: data?.username,
                online: data?.online,
            },
        );
    },
};
