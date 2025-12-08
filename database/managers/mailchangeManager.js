import Mailchange from "../models/mailchangeModel.js";
import Ids from "../../utils/generate/ids.js";

class MailchangeManager {
    static async createChangeToken(userId, newEmail) {
        const token = Ids.generateLongId();
        const mailchangeEntry = new Mailchange({
            userId: userId,
            mailchangeToken: token,
            newEmail: newEmail
        });
        await mailchangeEntry.save();
        return mailchangeEntry;
    }

    static async hasChangeToken(userId) {
        const changeEntry = await Mailchange.findOne({ userId: userId });
        return changeEntry ?? null;
    }

    static async getChangeToken(userId, token) {
        const changeEntry = await Mailchange.findOne({ userId: userId, mailchangeToken: token });
        return changeEntry ?? null;
    }
}

export default MailchangeManager;