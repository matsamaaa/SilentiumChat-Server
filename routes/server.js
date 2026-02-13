import express from 'express';
import PrivateDiscussionManager from '../database/managers/privateDiscussionManager.js';
import { validateToken } from '../middleware/auth.js';
import Log from '../utils/logs/logs.js';
import UserManager from '../database/managers/userManager.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Ids from '../utils/generate/ids.js';

import ServerManager from '../database/managers/serverManager.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const serverCode = req.params.code;
        const urlPath = String(req.originalUrl || req.url || '').split('?')[0];
        const lastSegment = urlPath.split('/').filter(Boolean).pop();
        const subFolder = lastSegment === 'icon' ? 'icons' : 'banners';
        const uploadDir = path.join(process.env.UPLOAD_DIR, 'servers', serverCode, subFolder);

        // Crée le dossier s’il n’existe pas
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, uploadDir);
        });
    },

    filename: (req, file, cb) => {
        const id = Ids.generateLongId();
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

router.post('/create', validateToken, async (req, res) => {
    const { name, owner } = req.body;
    try {
        const server = await ServerManager.createServer({ name, owner });
        res.json({ success: true, message: "Server created successfully", datas: { code: server.code, name: server.name } });
    } catch (error) {
        Log.Error("Error creating server:", error);
        res.status(500).json({ success: false, message: "Error creating server" });
    }
});

router.post('/:code/banner', validateToken, upload.single('banner'), async (req, res) => {
    const file = req.file;
    const id = req.user;
    const { code } = req.params;

    if (!file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // check if user is owner of the server
    const server = await ServerManager.getServerByOwnerAndCode(id, code);
    if (!server) {
        return res.status(403).json({ success: false, message: "You are not the owner of this server" });
    }

    try {
        await ServerManager.updateServerBanner(code, file.filename);
        res.json({ success: true, message: "Banner uploaded successfully", datas: { banner: file.filename } });
    } catch (error) {
        Log.Error("Error updating banner:", error);
        res.status(500).json({ success: false, message: "Error updating banner" });
    }
});

router.post('/:code/icon', validateToken, upload.single('icon'), async (req, res) => {
    const file = req.file;
    const id = req.user;
    const { code } = req.params;

    if (!file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // check if user is owner of the server
    const server = await ServerManager.getServerByOwnerAndCode(id, code);
    if (!server) {
        return res.status(403).json({ success: false, message: "You are not the owner of this server" });
    }

    try {
        await ServerManager.updateServerIcon(code, file.filename);
        res.json({ success: true, message: "Icon uploaded successfully", datas: { icon: file.filename } });
    } catch (error) {
        Log.Error("Error updating icon:", error);
        res.status(500).json({ success: false, message: "Error updating icon" });
    }
});

export default router;