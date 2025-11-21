import Log from "../../utils/logs/logs.js";
import AuthManager from "../../database/managers/authManager.js";
import UserManager from "../../database/managers/userManager.js";
import PrivateDiscussionManager from "../../database/managers/privateDiscussionManager.js";
import MessageManager from "../../database/managers/messageManager.js";
import FriendManager from "../../database/managers/friendManager.js";
import { onlineSessions } from "../sessions.js";

export default function sendMessageHandler(socket) {
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

        const friendsStatus = await FriendManager.getFriendsStatus(from, to);
        if(friendsStatus && friendsStatus.status == 'blocked') {
            Log.Error("Cannot send message to this user: blocked");
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
}