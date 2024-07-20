import { ConnectionType, HandlerType, ArglistType, UserListType } from "../../server/socket/interfaces";

const users: UserListType = {};

export default ({io, socket, handshakeQuery} : HandlerType) : void => {
  
  const { channelId, userName } = handshakeQuery;

  if (!users[channelId]) {
    users[channelId] = [];
  }

  const updateUserList = () => {
    io.to(channelId).emit('user_list:update', users[channelId]);
  }

  socket.on('user:add', async (user) => {
    socket.to(channelId).emit('log', `User ${userName} connected`);

    user.socketId = socket.id;

    users[channelId].push(user);

    updateUserList();
  })

  socket.on('disconnect', () => {
    if (!users[channelId]) return;

    socket.to(channelId).emit('log', `User ${userName} disconnected`);

    users[channelId] = users[channelId].filter((u) => u.socketId !== socket.id);

    updateUserList();
  })
}