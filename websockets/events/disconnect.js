import Log from "../../utils/logs/logs.js";
import { onlineSessions } from "../sessions.js";
import UserManager from "../../database/managers/userManager.js";

export default function disconnectHandler(socket) {
    // Use disconnecting so we can still broadcast to others.
    socket.on('disconnecting', async () => {
        const userId = socket.userId;
        if (!userId) {
            Log.Debug("socket disconnected (no userId)");
            return;
        }

        onlineSessions.delete(userId);
        socket.broadcast.emit('userStatus', { from: userId, userId, status: 'offline' });

        Log.Debug("user disconnected");
    });
}