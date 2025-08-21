import Token from "../../utils/generate/tokens";
import Auth from "../models/authModel";

class AuthManager {

    static async createAuth(uniqueId) {
        try {
            const token = Token.generateToken();

            const auth = new Auth({
                uniqueId: uniqueId,
                token: token,
            });

            await auth.save();

            return auth;
        } catch (error) {
            throw error;
        }
    }

    async deleteAuth(uniqueId) {
        try {
            await Auth.deleteOne({ uniqueId: uniqueId });
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

    async hasAuth(uniqueId) {
        try {
            return !!await Auth.findOne({ uniqueId: uniqueId });
        } catch (error) {
            throw error;
        }
    }

}

export default AuthManager;
