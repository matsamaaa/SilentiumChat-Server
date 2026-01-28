import express from 'express';
import PrivateDiscussionManager from '../database/managers/privateDiscussionManager.js';
import { validateToken } from '../middleware/auth.js';
import Log from '../utils/logs/logs.js';
import UserManager from '../database/managers/userManager.js';

const router = express.Router();

router.get('/:userId/messages', validateToken, async (req, res) => {
    const { userId } = req.params; // recipient user
    const { page = 1 } = req.query;
    const from = req.user;
    try {
        const username = await UserManager.getUsername(userId);

        const discussion = await PrivateDiscussionManager.getDiscussion(from, userId, page);
        if(!discussion) {
            return res.status(200).json(
                { 
                    success: true, 
                    message: "No messages found", 
                    datas: {
                        users: [from, userId],
                        encryptedMessages: [],
                        username: username
                    }
                }
            );
        }   

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            datas: discussion
        });
    } catch (error) {
        Log.Error("Error fetching messages:", error);
        return res.status(500).json({ success: false, message: "Error fetching messages" });
    }
});

router.get('/lastmessages', validateToken, async (req, res) => {
    const userId = req.headers['x-user-id'];

    try {
        let lastMessages = await PrivateDiscussionManager.getLastMessages(userId);

        lastMessages = await Promise.all(lastMessages.map(async discussion => {
            const otherUserId = discussion.users.find(id => id !== userId);
            const username = await UserManager.getUsername(otherUserId);
            return {
                ...discussion,
                username: username
            };
        }));

        return res.status(200).json({
            success: true,
            message: "Last messages fetched successfully",
            datas: lastMessages
        });
    } catch (error) {
        Log.Error("Error fetching last messages:", error);
        return res.status(500).json({ success: false, message: "Error fetching last messages" });
    }
});

router.patch('/:userId/status', validateToken, async (req, res) => {
    const { userId } = req.params;
    const from = req.user;
    if (!['accepted', 'refused'].includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    try {
        const updatedDiscussion = await PrivateDiscussionManager.updateDiscussionStatus(from, userId, req.body.status);
        return res.status(200).json({
            success: true,
            message: "Discussion status updated successfully",
            datas: updatedDiscussion
        });
    } catch (error) {
        Log.Error("Error updating discussion status:", error);
        return res.status(500).json({ success: false, message: "Error updating discussion status" });
    }
});

router.delete('/discussions/delete', validateToken, async (req, res) => {
    const userId = req.user;

    try {
        await PrivateDiscussionManager.deleteAllDiscussions(userId);
        return res.status(200).json({
            success: true,
            message: "All discussions deleted successfully"
        });
    } catch (error) {
        Log.Error("Error deleting all discussions:", error);
        return res.status(500).json({ success: false, message: "Error deleting all discussions" });
    }
});

export default router;