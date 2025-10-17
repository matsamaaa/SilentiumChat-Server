import express from 'express';
import FriendManager from '../database/managers/friendManager.js';
import Log from '../utils/logs/logs.js';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:friendId/status', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const doc = await FriendManager.getFriendsStatus(userId, friendId);
        res.json(doc ? { status: doc.status, doc: doc } : { status: null, doc: null });
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
        res.json({ message: result.message });
    } catch (error) {
        Log.Error("Error sending friend request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:friendId/accept', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.acceptFriendRequest(userId, friendId);
        res.json({ success: true });
    } catch (error) {
        Log.Error("Error accepting friend request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:friendId/refuse', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.refuseFriendRequest(userId, friendId);
        res.json({ success: true });
    } catch (error) {
        Log.Error("Error refusing friend request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:friendId/block', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;
    try {
        const result = await FriendManager.blockUser(userId, friendId);
        res.json({ message: result.message });
    } catch (error) {
        Log.Error("Error blocking user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:friendId/unblock', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.unblockUser(userId, friendId);
        res.json({ message: result.message });
    } catch (error) {
        Log.Error("Error unblocking user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/:friendId/cancel', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.cancelFriendRequest(userId, friendId);
        res.json({ message: result.message });
    } catch (error) {
        Log.Error("Error cancelling friend request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;