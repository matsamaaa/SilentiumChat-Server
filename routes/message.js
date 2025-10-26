import express from 'express';
import PrivateDiscussionManager from '../database/managers/privateDiscussionManager.js';
import { validateToken } from '../middleware/auth.js';
import Log from '../utils/logs/logs.js';

const router = express.Router();

router.get('/:userId/messages', validateToken, async (req, res) => {
    const { userId } = req.params; // recipient user
    const from = req.user;
    try {
        const discussion = await PrivateDiscussionManager.getDiscussion(from, userId);
        if(!discussion) {
            return res.status(200).json(
                { 
                    success: true, 
                    message: "No messages found", 
                    datas: {
                        users: [from, userId],
                        encryptedMessages: []
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
        const lastMessages = await PrivateDiscussionManager.getLastMessages(userId);
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

export default router;