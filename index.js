import express from "express";
import http from "http";
import { Server } from "socket.io";
import Log from "./utils/logs/logs.js";
import MessageManager from "./database/managers/messageManager.js";
import dotenv from "dotenv";
import connectToDatabase from "./database/connect.js";
import bodyParser from "body-parser";
import cors from "cors";

// routes
import authRoutes from './routes/auth.js';
import UserManager from "./database/managers/userManager.js";
import AuthManager from "./database/managers/authManager.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const io = new Server(server, {
    cors: { origin: "*" },
});

(async () => {
    await connectToDatabase();

    // api
    app.use(bodyParser.json());
    app.use('/auth', authRoutes);

    // websocket
    const onlineSessions = new Map();

    io.on('connection', (socket) => {
        Log.Debug("A user connected");

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

            onlineSessions.set(userId, socket.id);
        })

        // handle incoming messages
        socket.on('sendMessage', async ({ to, encryptedMessage, nonce }) => {
            if (!socket.userId || !socket.userToken) {
                Log.Error("Unauthorized: user not registered");
                return;
            }

            const auth = await AuthManager.isValidAuth(userId, userToken);
            if (!auth) {
                Log.Error("Unauthorized: invalid userId or userToken");
                return;
            }

            const from = socket.userId;

            // create a new message document
            const message = new MessageManager().createMessage({
                from,
                to,
                encryptedMessage,
                nonce
            });

            // send to the recipient
            // soit verifier si le destinataire est en ligne
            const recipientSocketId = onlineSessions.get(to);
            if (recipientSocketId) {
                socket.to(recipientSocketId).emit("receiveMessage", { from, encryptedMessage, nonce });
            }
        })

        socket.on('disconnect', () => {
            onlineSessions.delete(socket.userId);
        });
    });

    server.listen(30001, () => {
        Log.Info("Server listening on port 30001");
    });
})();