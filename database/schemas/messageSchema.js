import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    encryptedMessage: { type: String, required: true },
    nonce: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default messageSchema;