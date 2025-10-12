import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    friendId: { type: String, required: true },
    users: [String], // Array of two user IDs
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'blocked'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;