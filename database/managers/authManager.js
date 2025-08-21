import Token from "../../utils/generate/tokens";
import Auth from "../models/authModel";

class AuthManager {

    static async createAuth(userId) {
        try {
            const token = Token.generateToken();

            const auth = new Auth({
                user: userId,
                token: token,
            });

            await auth.save();

            return auth;
        } catch (error) {
            throw error;
        }
    }

    async getAuth(token) {
        try {
            return await Auth.findOne({ token }).populate('User');
        } catch (error) {
            throw error;
        }
    }

}

export default AuthManager;
