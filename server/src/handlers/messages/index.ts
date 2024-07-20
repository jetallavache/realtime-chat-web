import messageModel from '../../mongo/models/message.model';
import onError from '../../server/socket/error.socket';

import { HandlerType, ArglistType, MessageListType } from "../../server/socket/interfaces";

const messages : MessageListType = {};

export default ({io, socket, handshakeQuery} : HandlerType) : void => {
  const { channelId } = handshakeQuery;

  const updateMessageList = () => {
    io.to(channelId).emit('message_list:update', messages[channelId]);
  }

  socket.on('message:get', async () => {
    try {
      const _messages = await messageModel.find({ channelId: channelId });

      messages[channelId] = _messages;

      updateMessageList();
    } catch (error : any) {
      onError(error);
    }
  })

  socket.on('message:add', (message) => {
    messageModel.create(message).catch(onError);

    message.createdAt = Date.now();

    messages[channelId].push(message);

    updateMessageList();
  })

  socket.on('message:remove', (message) => {
    const { messageId, messageType, textOrPathToFile } = message;

    messageModel.deleteOne({ messageId }).catch(onError);

    messages[channelId] = messages[channelId].filter((m) => m.messageId !== messageId);

    updateMessageList();
  })
}