import mongoose from 'mongoose';
import messageSchema from '../schemas/messageSchema.js';

const privateDiscussionSchema = new mongoose.Schema({
    users: { 
        type: [String], 
        required: true, 
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length >= 2;
            },
            message: 'There must be at least 2 users.'
        }
    },
    encryptedMessages: { type: [messageSchema], required: true, default: [] },
    isWaitingForResponse: { type: Boolean, default: null }, // true: accepted, false: refused, null: no response yet
});

const PrivateDiscussion = mongoose.model('PrivateDiscussion', privateDiscussionSchema);

export default PrivateDiscussion;