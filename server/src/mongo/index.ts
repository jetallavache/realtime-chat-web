import mongoose from 'mongoose';
import config from '../config';

const { url } = config.mongo;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false,
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    family: 4,
};

export default {
    async connect() {
        mongoose
            .connect(url, options)
            .then(() => {
                console.log('⭐ Connected to the database saccessful: ', url);
            })
            .catch((err: any) => {
                console.log('❌ MongoDB connection error: ', err);
                process.exit();
            });
    },
    async disconnect() {
        await mongoose.disconnect();
    },
};
