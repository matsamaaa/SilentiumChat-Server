import express from 'express';
import FriendManager from '../database/managers/friendManager.js';
import Log from '../utils/logs/logs.js';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:friendId/status', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const status = await FriendManager.getFriendsStatus(userId, friendId);
        res.json({ status });
    } catch (error) {
        Log.Error("Error fetching user status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:friendId/request', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.sendFriendRequest(userId, friendId);
        res.json(result);
    } catch (error) {
        Log.Error("Error sending friend request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;