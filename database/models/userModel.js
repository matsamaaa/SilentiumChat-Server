import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    uniqueId: { type: String, required: true },
    publicKey: { type: String, required: true },

    username: { type: String, required: true },
    tag: { type: Number, required: true }, //mat_sama#0001
    avatar: { type: String, default: null },

    status: { type: String, default: 'online' }, // [offline] -> null, online, dnd, idle, invisible

    email: { type: String, required: true },
    password: { type: String, required: true },
    fakePassword: { type: String, default: null },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;