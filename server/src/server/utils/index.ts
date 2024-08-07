import config from '../../config';

const {
    server: { protocol, port, host },
} = config;

type BaseUriParts = {
    protocol: string;
    host: string;
    port: number;
};

export const buildHttpUri = ({ protocol, host, port }: BaseUriParts): string => {
    return `${protocol}://${host}:${port}`;
};

export default (): void => {
    console.log(`🔥 Server started: ${buildHttpUri({ protocol, port, host })}.`);
};
