import express from "express";
import http from "http";
import { Server } from "socket.io";
import Log from "./utils/logs/logs.js";
import MessageManager from "./database/managers/messageManager.js";
import dotenv from "dotenv";
import connectToDatabase from "./database/connect.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }, // autorise le front
});

(async () => {
    await connectToDatabase();

    // api
    app.use(bodyParser.json());
    app.use('/auth', import('./routes/auth.js'));

    // websocket
    io.on('connection', (socket) => {
        Log.Debug("A user connected");

        socket.on('register', ({ userId, userToken, publicKey }) => {
            // save public key

            socket.userId = userId;
            socket.publicKey = publicKey;
        })

        // handle incoming messages
        socket.on('sendMessage', ({ to, encryptedMessage, nonce }) => {
            if (!socket.userId) {
                Log.Error("Unauthorized: user not registered");
                return;
            }

            const from = socket.userId;

            // create a new message document
            const message = new MessageManager().createMessage({
                from,
                to: '',
                encryptedMessage,
                nonce
            });

            // send to the recipient
            socket.to(to).emit("receiveMessage", { from, encryptedMessage, nonce });
        })

        socket.on('disconnect', () => {
            Log.Debug("A user disconnected");
        });
    });

    server.listen(30001, () => {
        Log.Info("Server listening on port 30001");
    });
})();