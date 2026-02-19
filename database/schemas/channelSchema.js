import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false }
});

export default channelSchema;