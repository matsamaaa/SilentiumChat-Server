import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Auth = mongoose.model('Auth', authSchema);

export default Auth;
