import Log from "../../utils/logs/logs.js";
import { onlineSessions } from "../sessions.js";

export default function disconnectHandler(socket) {
    socket.on('disconnect', () => {
        onlineSessions.delete(socket.userId);

        Log.Debug("user disconnected");
    });
}