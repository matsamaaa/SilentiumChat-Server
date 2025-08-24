import express from 'express';
import UserManager from '../database/managers/userManager.js';
import Log from '../utils/logs/logs.js';

const router = express.Router();

router.get('/:userId/publicKey', async (req, res) => {
    const { userId } = req.params;
    try {
        const publicKey = await UserManager.getUserPublicKey(userId);
        res.json({ publicKey });
    } catch (error) {
        Log.Error("Error fetching user public key:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:username/:code/id', async (req, res) => {
    const { username, code } = req.params;
    try {
        const user = await UserManager.getUserByFullUsername(username, Number(code));
        res.json({ userId: user ? user.uniqueId : null });
    } catch (error) {
        Log.Error("Error fetching user ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:userId/username', async (req, res) => {
    const { userId } = req.params;
    try {
        const username = await UserManager.getUsername(userId);
        res.json({ username });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;