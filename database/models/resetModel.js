import mongoose from "mongoose";

const resetSchema = new mongoose.Schema({
    userId: String,
    resetToken: String,
    expires: {
        type: Date,
        default: Date.now,
        expires: 600
    },
});

const Reset = mongoose.model("Reset", resetSchema);

export default Reset;