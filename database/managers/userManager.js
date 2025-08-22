import Ids from "../../utils/generate/ids.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

class UserManager {
    static async createUser({ email, username, tag, password, publicKey }) {
        try {
            console.log(publicKey)
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                uniqueId: Ids.generateId(await this.getUsersSize() + 1),
                publicKey,

                username, 
                tag,

                email, 
                password: hashedPassword
            });

            await user.save();
            return user;
        } catch (error) {
            throw new Error("Database error");
        }
    }

    static async getUsersSize() {
        try {
            return await User.countDocuments();
        } catch (error) {
            throw new Error("Database error");
        }
    }

    static async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Database error");
        }
    }

    static async getUserByFullUsername(username, tag) {
        try {
            const user = await User.findOne({ username, tag });
            return user;
        } catch (error) {
            throw new Error("Database error");
        }
    }
}

export default UserManager;