import express from 'express';
import UserManager from '../database/managers/userManager.js';
import Log from '../utils/logs/logs.js';
import { validateToken } from '../middleware/auth.js';
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

export default router;