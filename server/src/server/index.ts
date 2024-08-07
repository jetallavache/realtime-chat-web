import express, { response } from 'express';
import http from 'http';

import config from '../config';
import database from '../mongo';
import setupServerMiddleware from './middleware';
import ServerSocket from './socket';
import setupServer from './utils';

const { server } = config;

export default async () => {
    /** Initializing an Express application */
    const app = express();

    /** Connect to MongoDB */
    await database.connect();

    require('../mongo/models/channel.model');
    require('../mongo/models/message.model');
    require('../mongo/models/user.model');

    /** Вasic server settings */
    setupServerMiddleware(app);

    /** Server handling */
    const httpServer = http.createServer(app);

    /** Setup the Socket IO */
    new ServerSocket(httpServer);

    /** Healthcheck */
    app.get('/ping', (req, res, next) => {
        return res.status(200).json({ message: 'pong!' });
    });

    /** Socket information */
    app.get('/status', (req, res, next) => {
        return res.status(200).json({ users: ServerSocket.instance.clients });
    });

    /** Listen for connections */
    httpServer.listen(server.port, setupServer);
};
