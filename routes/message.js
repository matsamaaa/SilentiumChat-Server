import express from 'express';
import PrivateDiscussionManager from '../database/managers/privateDiscussionManager.js';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId/messages', validateToken, async (req, res) => {
    const { userId } = req.params; // recipient user
    const from = req.user;

    try {
        const discussion = await PrivateDiscussionManager.getDiscussion(from, userId);
        if(!discussion) {
            return res.status(200).json({ from, to: userId, encryptedMessages: [] });
        }

        return res.status(200).json(discussion);
    } catch (error) {
        Log.Error("Error fetching messages:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;