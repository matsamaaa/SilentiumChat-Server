import express from 'express';
import UserManager from '../database/managers/userManager.js';
import Log from '../utils/logs/logs.js';
import { validateToken } from '../middleware/auth.js';
import PasswordValidator from '../utils/validations/password.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import Ids from '../utils/generate/ids.js';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(process.env.UPLOAD_DIR, 'avatars', req.user);

        // Crée le dossier s’il n’existe pas
        fs.mkdir(userDir, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, userDir);
        });
    },

    filename: (req, file, cb) => {
        const id = Ids.generateAvatarId();
        const ext = path.extname(file.originalname);
        cb(null, id + ext);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, or WEBP files are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // max 10 Mo
});

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

router.patch('/password/update', validateToken, async (req, res) => {
    const { newPassword, passwordConfirmation, currentPassword } = req.body;

    try {
        const user = await UserManager.getUserById(req.user);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // compare hashed password and password
        if (!await bcrypt.compare(currentPassword, user.password)) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        if (!PasswordValidator.isValidPassword(newPassword)) {
            return res.status(400).json({ success: false, message: "Invalid password format" });
        }

        if (!PasswordValidator.isSamePassword(newPassword, passwordConfirmation)) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        await UserManager.updatePassword(req.user, newPassword);
        res.json({ success: true });
    } catch (error) {
        Log.Error("Error updating password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/avatar', validateToken, upload.single('avatar'), async (req, res) => {
    const file = req.file;
    const id = req.user;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        await UserManager.uploadAvatar(id, file.filename);
        res.json({ success: true });
    } catch (error) {
        Log.Error("Error updating avatar:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/avatar', validateToken, async (req, res) => {
    const user = req.user;
    try {
        const fileDoc = await UserManager.getAvatar(user);

        if (!fileDoc) return res.status(204).json({ error: "No avatar uploaded" });

        const filePath = path.join(process.env.UPLOAD_DIR, 'avatars', user);
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
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/avatar', validateToken, async (req, res) => {
    const user = req.user;
    try {
        await UserManager.deleteAvatar(user);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting avatar:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;