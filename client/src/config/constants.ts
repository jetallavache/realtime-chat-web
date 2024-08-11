const { VITE_API_URL, VITE_API_WS, VITE_VERSION } = import.meta.env;

export default {
    apiUrl: VITE_API_URL || 'http://localhost:8080/',
    wsUrl: VITE_API_WS || 'ws://localhost:8080',
    version: VITE_VERSION || '0.0.0',
};
