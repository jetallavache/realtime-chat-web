import mongoose from 'mongoose';
import { boolean } from 'zod';

const { Schema, model } = mongoose;

interface IUser {
    uid: string;
    username: string;
    online: boolean;
}

const userSchema = new Schema<IUser>(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        online: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export default model<IUser>('User', userSchema);
