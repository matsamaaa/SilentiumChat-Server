import mongoose from 'mongoose';
import Log from '../utils/logs/logs.js';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        Log.Info("Connected to MongoDB");
    } catch (error) {
        Log.Error("Error connecting to MongoDB:", error);
    }
};

export default connectToDatabase;