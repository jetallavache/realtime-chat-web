import mongoose from 'mongoose'

const { Schema, model } = mongoose

interface IUser {
  userId: string,
  name: string;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>("User", userSchema);