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
            return res.status(200).json({ users: [from, userId], encryptedMessages: [] });
        }   

        return res.status(200).json(discussion);
    } catch (error) {
        Log.Error("Error fetching messages:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/lastmessages', validateToken, async (req, res) => {
    const userId = req.headers['x-user-id'];

    try {
        const lastMessages = await PrivateDiscussionManager.getLastMessages(userId);
        return res.status(200).json(lastMessages);
    } catch (error) {
        Log.Error("Error fetching last messages:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch('/:userId/status', validateToken, async (req, res) => {
    const { userId } = req.params;
    const from = req.user;
    if (!['accepted', 'refused'].includes(req.body.status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const updatedDiscussion = await PrivateDiscussionManager.updateDiscussionStatus(from, userId, req.body.status);
        return res.status(200).json(updatedDiscussion);
    } catch (error) {
        Log.Error("Error updating discussion status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;