import express from "express";
import http from "http";
import { Server } from "socket.io";
import Log from "./utils/logs/logs.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

// routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

// managers
import connectToDatabase from "./database/connect.js";
import UserManager from "./database/managers/userManager.js";
import AuthManager from "./database/managers/authManager.js";
import PrivateDiscussionManager from "./database/managers/privateDiscussionManager.js";

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
    app.use('/user', userRoutes);

    // websocket
    const onlineSessions = new Map();

    io.on('connection', (socket) => {
        Log.Debug("A user connected");

        socket.on('register', async ({ userId, userToken }) => {
            // save public key

            const auth = await AuthManager.isValidAuth(userId, userToken);
            console.log(userId, userToken)
            if (!auth) {
                Log.Error("Unauthorized: invalid userId or userToken");
                return;
            }

            socket.userId = userId;
            socket.userToken = userToken;
            socket.publicKey = await UserManager.getUserPublicKey(userId);

            onlineSessions.set(userId, socket);
        })

        // handle incoming messages
        socket.on('sendMessage', async ({ to, encryptedMessage }) => {
            console.log('message received', encryptedMessage)
            if (!socket.userId || !socket.userToken) {
                Log.Error("Unauthorized: user not registered");
                return;
            }

            const from = socket.userId;
            const auth = await AuthManager.isValidAuth(from, socket.userToken);
            if (!auth) {
                Log.Error("Unauthorized: invalid userId or userToken");
                return;
            }

            // create a new message document
            const message = {
                from,
                to,
                encryptedMessage
            };

            let discussion = await PrivateDiscussionManager.getDiscussion(from, to);
            discussion = discussion || await PrivateDiscussionManager.createDiscussion(from, to);

            await PrivateDiscussionManager.addMessage(discussion._id, message);
            
            // send to the recipient
            const recipientSocketId = onlineSessions.get(to);
            if (recipientSocketId) {
                socket.to(recipientSocketId.id).emit("receiveMessage", { from, encryptedMessage });
            }
        })

        socket.on('disconnect', () => {
            onlineSessions.delete(socket.userId);

            Log.Debug("A user disconnected");
        });
    });

    server.listen(30001, () => {
        Log.Info("Server listening on port 30001");
    });
})();