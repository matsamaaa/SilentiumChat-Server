import mongoose from 'mongoose';
import Log from '../utils/logs/logs';
import { URL_MONGO } from process.env;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(URL_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        Log.Info("Connected to MongoDB");
    } catch (error) {
        Log.Error("Error connecting to MongoDB:", error);
    }
};

export default connectToDatabase;