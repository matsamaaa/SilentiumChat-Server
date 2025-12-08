import mongoose from "mongoose";

const mailchangeSchema = new mongoose.Schema({
    userId: String,
    mailchangeToken: String,
    newEmail: String,
    expires: {
        type: Date,
        default: Date.now,
        expires: 600
    },
});

const Mailchange = mongoose.model("Mailchange", mailchangeSchema);

export default Mailchange;