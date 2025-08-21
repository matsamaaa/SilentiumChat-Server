import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userToken: { type: String, required: true },
    publicKey: { type: String, required: true },

    username: { type: String, required: true },
    tag: { type: Number, required: true }, //mat_sama#0001

    email: { type: String, required: true },
    password: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;