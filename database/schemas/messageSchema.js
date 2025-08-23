import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    encryptedMessage: { type: String, required: true },
    encryptedMessageBySender: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },

    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    publicKeyUsed: { type: String, required: true },
    publicKeySenderUsed: { type: String, required: true }
});

export default messageSchema;