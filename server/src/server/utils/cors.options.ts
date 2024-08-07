import { CorsOptions } from 'cors';
import { CustomError } from '../errors/custom.error';
import config from '../../config';

export const whitelist = config.cors.allowedOrigin;

export const corsOptions: CorsOptions | undefined = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new CustomError('Not allowed by CORS', 423));
        }
    },
    credentials: true,
};
