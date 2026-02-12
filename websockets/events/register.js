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

        const status = await UserManager.getUserStatus(userId);

        socket.userId = userId;
        socket.userToken = userToken;
        socket.status = status || "offline";
        socket.publicKey = await UserManager.getUserPublicKey(userId);

        if(!status) {
            await UserManager.updateStatus(userId, "online");
            socket.status = "online";
        }

        onlineSessions.set(userId, socket);
        // Notify self + others (client expects { userId, status })
        socket.emit('userStatus', { from: userId, userId, status: socket.status });
        socket.broadcast.emit('userStatus', { from: userId, userId, status: socket.status });
    })
}