import express from 'express';
import config from '../config';
import { setupServer } from './utils';
import setupServerMiddleware from './middleware';
import setupSocketIO from './socket';
import database from '../mongo';

const { server } = config;

export default async () => {

    console.log(config);
    
    const app = express();

    await database.connect();

    setupServerMiddleware({ app });

    setupSocketIO({ app });

    app.listen(server.port, setupServer);
};
