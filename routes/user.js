import express from 'express';
import UserManager from '../database/managers/userManager.js';
import FriendManager from '../database/managers/friendManager.js';
import Log from '../utils/logs/logs.js';
import path from 'path';
import fs from 'fs';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId/publicKey', validateToken, async (req, res) => {
    const { userId } = req.params;
    try {
        const publicKey = await UserManager.getUserPublicKey(userId);
        res.json({ publicKey });
    } catch (error) {
        Log.Error("Error fetching user public key:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:username/:code/id', validateToken, async (req, res) => {
    const { username, code } = req.params;
    try {
        const user = await UserManager.getUserByFullUsername(username, Number(code));
        res.json({ userId: user ? user.uniqueId : null });
    } catch (error) {
        Log.Error("Error fetching user ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:userId/username', validateToken, async (req, res) => {
    const { userId } = req.params;
    try {
        const username = await UserManager.getUsername(userId);
        res.json({ username });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:userId/avatar', validateToken, async (req, res) => {
    const { userId } = req.params;
    const user = req.user;
    try {
        const friend = await FriendManager.getFriendsStatus(user, userId);
        if (friend?.status === 'accepted') {
            const fileDoc = await UserManager.getAvatar(userId);
            if (!fileDoc) return res.status(204).json({ error: "No avatar uploaded" });

            const filePath = path.join(process.env.UPLOAD_DIR, 'avatars', userId);
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found on disk" });

            const ext = path.extname(fileDoc).toLowerCase();
            const mimeTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.gif': 'image/gif'
            };

            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.setHeader("Content-Type", contentType);
            res.sendFile(`${fileDoc}`, { root: filePath })
        } else {
            return res.status(403).json({ error: "You are not friends with this user" });
        }
    } catch (error) {
        Log.Error("Error fetching user avatar:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;