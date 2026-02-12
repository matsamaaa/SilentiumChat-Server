import UserManager from "../../database/managers/userManager.js";
import Log from "../../utils/logs/logs.js";

export default function updateUserStatus(socket) {

    socket.on('updateUserStatus', async ({ status }) => {
        if (!socket.userId || !socket.userToken) {
            return;
        }

        // allow null (represents offline in DB convention)
        if (status === undefined) {
            return;
        }

        const acceptedStatus = [null, 'online', 'offline', 'dnd', 'idle', 'invisible'];
        if (!acceptedStatus.includes(status)) {
            return;
        }

        const statusToStore = status === 'offline' ? null : status;
        const statusToEmit = statusToStore === null ? 'offline' : statusToStore;

        try {
            await UserManager.updateStatus(socket.userId, statusToStore);
            socket.status = statusToEmit;

            socket.emit('userStatus', { from: socket.userId, userId: socket.userId, status: statusToEmit });
            socket.broadcast.emit('userStatus', { from: socket.userId, userId: socket.userId, status: statusToEmit });
        } catch (err) {
            Log.Error("Failed to update user status:", err);
        }
    });

}