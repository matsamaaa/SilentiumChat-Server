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
        res.json({
            success: true,
            message: "Friend status fetched successfully",
            datas: 
                doc
                    ? { status: doc.status, doc: doc }
                    : { status: null, doc: null }
        });
    } catch (error) {
        Log.Error("Error fetching user status:", error);
        res.status(500).json({ success: false, message: "Status fetching error" });
    }
});

router.post('/:friendId/request', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.sendFriendRequest(userId, friendId);
        res.json({ success: true, message: "Friend request sent successfully", datas: { message: result.message } });
    } catch (error) {
        Log.Error("Error sending friend request:", error);
        res.status(500).json({ success: false, message: "Friend request sending error" });
    }
});

router.post('/:friendId/remove', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        await FriendManager.removeFriend(userId, friendId);
        res.json({ success: true, message: "Friend removed successfully" });
    } catch (error) {
        Log.Error("Error removing friend:", error);
        res.status(500).json({ success: false, message: "Friend removing error" });
    }
});

router.post('/:friendId/accept', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.acceptFriendRequest(userId, friendId);
        res.json({ success: true, message: "Friend request accepted successfully" });
    } catch (error) {
        Log.Error("Error accepting friend request:", error);
        res.status(500).json({ success: false, message: "Friend request accepting error" });
    }
});

router.post('/:friendId/refuse', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.refuseFriendRequest(userId, friendId);
        res.json({ success: true, message: "Friend request refused successfully" });
    } catch (error) {
        Log.Error("Error refusing friend request:", error);
        res.status(500).json({ success: false, message: "Friend request refusing error" });
    }
});

router.post('/:friendId/block', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;
    try {
        const result = await FriendManager.blockUser(userId, friendId);
        res.json({ success: true, message: "User blocked successfully" });
    } catch (error) {
        Log.Error("Error blocking user:", error);
        res.status(500).json({ success: false, message: "Error blocking user" });
    }
});

router.post('/:friendId/unblock', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.unblockUser(userId, friendId);
        res.json({ success: true, message: result.message });
    } catch (error) {
        Log.Error("Error unblocking user:", error);
        res.status(500).json({ success: false, message: error || "Error unblocking user" });
    }
});

router.post('/:friendId/cancel', validateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user;

    try {
        const result = await FriendManager.cancelFriendRequest(userId, friendId);
        res.json({ success: true, message: result.message });
    } catch (error) {
        Log.Error("Error cancelling friend request:", error);
        res.status(500).json({ success: false, message: "Friend request cancelling error" });
    }
});

router.get('/list/:status', validateToken, async (req, res) => {
    const userId = req.user;
    const { status } = req.params;

    try {
        const friendsList = await FriendManager.getFriendsList(userId, status);
        res.json({
            success: true,
            message: "Friend list fetched successfully",
            datas: friendsList
        });
    } catch (error) {
        Log.Error("Error fetching friend list:", error);
        res.status(500).json({ success: false, message: "Friend list fetching error" });
    }
});

export default router;