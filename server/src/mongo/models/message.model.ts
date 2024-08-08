import mongoose, { Types } from 'mongoose';

const { Schema, model } = mongoose;

interface MongooseTypes {
    type: Types.ObjectId;
    required?: boolean;
    ref: string;
}

interface IMessage {
    id: string;
    from: MongooseTypes;
    to: MongooseTypes;
    content: string;
    timestamp: string;
}

const messageSchema = new Schema<IMessage>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        from: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: mongoose.Types.ObjectId,
            ref: 'Channel',
        },
        content: {
            type: String,
            default: '',
        },
        timestamp: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    },
);

export default model<IMessage>('Message', messageSchema);
