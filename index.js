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
import messageRoute from './routes/message.js';
import filesRoute from './routes/files.js';

// managers
import connectToDatabase from "./database/connect.js";
import UserManager from "./database/managers/userManager.js";
import AuthManager from "./database/managers/authManager.js";
import PrivateDiscussionManager from "./database/managers/privateDiscussionManager.js";
import MessageManager from "./database/managers/messageManager.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"]
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
    app.use('/message', messageRoute);
    app.use('/files', filesRoute);

    // websocket
    const onlineSessions = new Map();

    io.on('connection', (socket) => {
        Log.Debug("user connected");

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

        // handle incoming messages
        socket.on('sendMessage', async ({ to, encryptedMessage, encryptedMessageBySender, file}) => {
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
            const message = new MessageManager();
            message.createMessage(
                from, 
                to, 
                encryptedMessage, 
                encryptedMessageBySender, 
                await UserManager.getUserPublicKey(to), 
                socket.publicKey
            );
            if (file) message.addFile(file);

            const finalMessage = message.getMessage();

            let discussion = await PrivateDiscussionManager.getDiscussion(from, to);
            discussion = discussion || await PrivateDiscussionManager.createDiscussion(from, to);

            await PrivateDiscussionManager.addMessage(discussion._id, finalMessage);
            
            // send to the recipient
            const recipientSocketId = onlineSessions.get(to);
            if (recipientSocketId) {
                socket.to(recipientSocketId.id).emit("receiveMessage", finalMessage);
            }
        })

        socket.on('disconnect', () => {
            onlineSessions.delete(socket.userId);

            Log.Debug("user disconnected");
        });
    });

    server.listen(process.env.PORT, () => {
        Log.Info(`Server listening on port ${process.env.PORT}`);
    });
})();