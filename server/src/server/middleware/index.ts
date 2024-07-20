import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorMiddleware from './error.middleware';
import config from '../../config';
// import routes from '../../chat';

export default ({ app }: { app: Application }): void => {
    app.use(cors({
        origin: config.allowedOrigin
      }));

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    // app.use(config.chat.url, routes());

    app.use(helmet());

    app.use(errorMiddleware);
}

