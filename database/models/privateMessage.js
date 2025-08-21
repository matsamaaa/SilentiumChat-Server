import mongoose from 'mongoose';
import messageSchema from '../schemas/messageSchema';

const privateMessageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    encryptedMessages: { type: [messageSchema], required: true },
});

const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

export default PrivateMessage;