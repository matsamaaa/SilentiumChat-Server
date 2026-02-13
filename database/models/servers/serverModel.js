import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
    code: { type: String, required: true, unique: true }, // invite code
    icon: { type: String, default: null },
    banner: { type: String, default: null },
});

const Server = mongoose.model('Server', serverSchema);

export default Server;