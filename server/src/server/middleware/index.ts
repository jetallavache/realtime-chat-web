import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorMiddleware from './error.middleware';
import config from '../../config';
import routes from '../../http';
import { corsOptions } from '../utils/cors.options';
import { printLogs } from '../utils/logs';

export default (app: Application): void => {
    /** Restrict access to all but the specified clients */
    app.use(cors(corsOptions));

    /** Log the request */
    app.use(printLogs);

    /** Parse the body of the request  */
    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    /** Defining routes for sending requests */
    app.use(config.chat.url, routes());

    /** Setting HTTP headers related to security */
    app.use(helmet());

    /** Handling all incoming errors */
    app.use(errorMiddleware);
};
