import mongoose from 'mongoose';
import messageSchema from '../schemas/messageSchema';

const privateDiscussionSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    encryptedMessages: { type: [messageSchema], required: true },
});

const PrivateDiscussion = mongoose.model('PrivateDiscussion', privateDiscussionSchema);

export default PrivateDiscussion;