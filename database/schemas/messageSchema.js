import mongoose from 'mongoose';
import { type } from 'os';

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    encryptedMessage: { type: String, required: true },
    nonce: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

export default messageSchema;