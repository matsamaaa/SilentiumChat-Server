import express from 'express';
import multer from 'multer';
import { validateToken } from '../middleware/auth.js';
import FileManager from '../database/managers/filleManager.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

async function createMongoFile(req, res, next) {
    try {
        const newFile = await FileManager.createFile();
        req.mongoFile = newFile; // on stocke le doc dans la req
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create DB entry" });
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), process.env.UPLOAD_DIR));
    },
    filename: (req, file, cb) => {
        cb(null, req.mongoFile._id.toString());
    }
});

const upload = multer({ storage });

router.post('/upload', validateToken, createMongoFile, upload.single('file'), async (req, res) => {
    const { iv, authTag, encryptedKey, encryptedKeySender } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const contentType = file.mimetype || 'application/octet-stream';

    // create mongo File
    const updatedFile = await FileManager.addDataToFile(
        req.mongoFile._id,
        contentType,
        iv,
        authTag,
        encryptedKey,
        encryptedKeySender
    );

    // return response
    return res.json({
        success: true,
        fileId: updatedFile._id
    });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { id } = req.params;
        const fileDoc = await FileManager.getFileById(id);

        if (!fileDoc) return res.status(404).json({ error: "File not found" });

        const filePath = path.join(process.env.UPLOAD_DIR, fileDoc._id.toString());
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found on disk" });

        res.setHeader("Content-Type", fileDoc.contentType || "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${fileDoc._id.toString()}"`);

        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id/meta', async (req, res) => {
    const { id } = req.params;

    try {
        const fileDoc = await FileManager.getFileById(id);

        if (!fileDoc) return res.status(404).json({ error: "File not found" });

        res.json(fileDoc.metadata);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;