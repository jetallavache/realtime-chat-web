import mongoose from 'mongoose'

const { Schema, model } = mongoose

interface IMessage {
    messageId: string,
    text: string,
    channelId: string,
    userId: string,
    userName: string,
  }

const messageSchema = new Schema<IMessage>(
  {
    messageId: {
      type: String,
      required: true,
      unique: true
    },
    text: {
      type: String,
      required: true
    },
    channelId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default model<IMessage>('Message', messageSchema)