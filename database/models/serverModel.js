import mongoose from 'mongoose';
import channelSchema from '../schemas/channelSchema.js';

const serverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
    code: { type: String, required: true, unique: true }, // invite code
    icon: { type: String, default: null },
    banner: { type: String, default: null },
    members: [{ type: String, ref: 'User' }], // list of user IDs
    channels: { type: [channelSchema], required: true, default: []}
});

const Server = mongoose.model('Server', serverSchema);

export default Server;