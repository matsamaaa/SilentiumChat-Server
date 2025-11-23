import express from "express";
import http from "http";
import { Server } from "socket.io";
import Log from "./utils/logs/logs.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

// websockets
import initWebSocket from "./websockets/index.js";

// routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import messageRoute from './routes/message.js';
import filesRoute from './routes/files.js';
import meRoute from './routes/me.js';
import friendsRoute from './routes/friends.js';
import mailRoute from './routes/mail.js';

// managers
import connectToDatabase from "./database/connect.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"]
}));

(async () => {
    await connectToDatabase();

    // api
    app.use(bodyParser.json());
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    app.use('/message', messageRoute);
    app.use('/files', filesRoute);
    app.use('/me', meRoute);
    app.use('/friends', friendsRoute);
    app.use('/mail', mailRoute);

    // websocket
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } }); 

    initWebSocket(io);

    // start server
    server.listen(process.env.PORT, () => {
        Log.Info(`Server listening on port ${process.env.PORT}`);
    });
})();