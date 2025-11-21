import AuthManager from "../../database/managers/authManager.js";
import UserManager from "../../database/managers/userManager.js";
import Log from "../../utils/logs/logs.js";
import { onlineSessions } from "../sessions.js";

export default function registerHandler(socket) {
    socket.on('register', async ({ userId, userToken }) => {
        // save public key

        const auth = await AuthManager.isValidAuth(userId, userToken);
        if (!auth) {
            Log.Error("Unauthorized: invalid userId or userToken");
            return;
        }

        socket.userId = userId;
        socket.userToken = userToken;
        socket.publicKey = await UserManager.getUserPublicKey(userId);

        onlineSessions.set(userId, socket);
    })
}