// import userHandlers from './handlers/user.handlers.js'
// import messageHandlers from './handlers/message.handlers.js'

import { Application } from 'express';
import { createServer } from 'http'
import { Server } from 'socket.io'

import config from '../../config';
import usersHandler from '../../handlers/users'
import messagesHandler from '../../handlers/messages'

import { ConnectionType } from './interfaces'

const onConnection = ({io, socket} : ConnectionType) : void => {
    
    const { channelId, userName } = socket.handshake.query

    // socket.channelId = channelId
    // socket.userName = userName

    const handshakeQuery = {
        channelId: Array.isArray(channelId) ? channelId[0] : channelId || "",
        userName: Array.isArray(userName) ? userName[0] : userName || ""
    }

    socket.join(channelId || "")

    usersHandler({io, socket, handshakeQuery})

    messagesHandler({io, socket, handshakeQuery})
}

export default ({ app }: { app: Application }): void => {
    const httpServer = createServer(app)

    const io = new Server(httpServer, {
        cors: { origin: config.allowedOrigin },
        serveClient: false
    })

    io.on('connection', (socket) => {
        onConnection({io, socket})
    })
}
