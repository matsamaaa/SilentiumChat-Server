import mongoose from 'mongoose';
import messageSchema from '../schemas/messageSchema.js';

const privateDiscussionSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    encryptedMessages: { type: [messageSchema], required: true, default: [] },
});

const PrivateDiscussion = mongoose.model('PrivateDiscussion', privateDiscussionSchema);

export default PrivateDiscussion;