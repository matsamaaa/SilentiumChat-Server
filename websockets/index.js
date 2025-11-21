import Log from "../utils/logs/logs.js";
import registerHandler from "./events/register.js";
import sendMessageHandler from "./events/sendMessage.js";
import disconnectHandler from "./events/disconnect.js";

export default function initWebSocket(io) {
    io.on('connection', (socket) => {
        Log.Debug("New user connected");

        registerHandler(socket);
        sendMessageHandler(socket);
        disconnectHandler(socket);
    });
}