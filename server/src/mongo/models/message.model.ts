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
            required: true,
            ref: 'User',
        },
        to: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Channel',
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

export default model<IMessage>('Message', messageSchema);
