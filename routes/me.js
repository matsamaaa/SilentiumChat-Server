import express from 'express';
import UserManager from '../database/managers/userManager.js';
import Log from '../utils/logs/logs.js';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();

router.patch('/username', validateToken, async (req, res) => {
    const { username } = req.body;
    try {
        await UserManager.updateUsername(req.user, username);
        res.json({ success: true });
    } catch (error) {
        Log.Error("Error updating username:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch('/tag', validateToken, async (req, res) => {
    const { tag } = req.body;
    try {
        await UserManager.updateTag(req.user, tag);
        res.json({ success: true });
    } catch (error) {
        Log.Error("Error updating tag:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;