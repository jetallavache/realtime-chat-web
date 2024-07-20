import 'dotenv/config.js';

const {
    NODE_ENV,
    PORT,
    HOST,
    M_USERNAME,
    M_PASSWORD,
    M_HOSTNAME,
    M_PORT,
    M_DATABASE,
  } = process.env;

export default {
    build: NODE_ENV,
    server: {
        port: parseInt(PORT as string) || 8080,
        host: HOST || 'localhost',
    },
    chat: {
        url: '/chat/',
    },
    mongo: {
        url: `mongodb://${M_USERNAME}:${M_PASSWORD}@${M_HOSTNAME}:${M_PORT}/${M_DATABASE}?authMechanism=DEFAULT&authSource=${M_DATABASE}`,
    },
    allowedOrigin: 'http://localhost:3000',
};
