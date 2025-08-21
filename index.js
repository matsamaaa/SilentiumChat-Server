import express from "express";
import http from "http";
import { Server } from "socket.io";
import Log from "./utils/logs/logs";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }, // autorise le front
});

io.on("connection", (socket) => {
    Log.Debug("A user connected");

    socket.on("register", ({ userId, userToken, publicKey }) => {
        // save public key
    })

    socket.on("sendMessage", ({ to, encryptedMessage, nonce }) => {
        // send the encrypted message to the recipient

        // create a new message document

        // send to the recipient
        socket.to(to).emit("receiveMessage", { from, encryptedMessage, nonce });
    })

    socket.on("disconnect", () => {
        Log.Debug("A user disconnected");
    });
});

server.listen(30001, () => {
    Log.Info("Server listening on port 30001");
});