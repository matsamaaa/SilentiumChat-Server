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

        try {
            // Persist offline as null in DB (current convention in this codebase)
            await UserManager.updateStatus(userId, null);
        } catch (err) {
            Log.Error("Failed to update status on disconnect:", err);
        }

        onlineSessions.delete(userId);
        socket.broadcast.emit('userStatus', { from: userId, userId, status: 'offline' });

        Log.Debug("user disconnected");
    });
}