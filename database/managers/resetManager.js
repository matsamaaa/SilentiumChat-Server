import resetModel from "../models/resetModel.js";
import Ids from "../../utils/generate/ids.js";

class ResetManager {
    static async createResetToken(userId) {
        const token = Ids.generateLongId();
        const resetEntry = new resetModel({
            userId: userId,
            resetToken: token,
        });
        await resetEntry.save();
        return resetEntry;
    }

    static async hasResetToken(userId) {
        const resetEntry = await resetModel.findOne({ userId: userId });
        return resetEntry ?? null;
    }

    static async getResetToken(userId, token) {
        const resetEntry = await resetModel.findOne({ userId: userId, resetToken: token });
        return resetEntry ?? null;
    }
}

export default ResetManager;