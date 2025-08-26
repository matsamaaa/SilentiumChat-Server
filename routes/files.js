import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { validateToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer();

let gfsBucket;

mongoose.connection.once('open', () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

router.post('/upload', validateToken, upload.single('file'), (req, res) => {
    try {
        if (!gfsBucket) {
            return res.status(500).json({ error: "GridFSBucket not initialized" });
        }

        const file = req.file;
        const { to, iv, authTag, encryptedKey, encryptedKeySender } = req.body;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const contentType = file.mimetype || 'application/octet-stream';

        const uploadStream = gfsBucket.openUploadStream(file.originalname || 'encryptedFile', {
            contentType,
            metadata: {
                to,
                iv,
                authTag,
                encryptedKey,
                encryptedKeySender
            }
        });

        uploadStream.end(file.buffer);

        uploadStream.on('finish', () => {
            return res.json({
                success: true,
                fileId: uploadStream.id
            });
        });

        uploadStream.on('error', (error) => {
            return res.status(500).json({ error: "Error uploading file" });
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const file = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ error: "File not found" });
        }

        res.set("Content-Type", file[0].contentType);
        res.set("Content-Disposition", `attachment; filename="${file[0].filename}"`);

        const downloadStream = gfsBucket.openDownloadStream(file[0]._id);
        downloadStream.pipe(res);

        downloadStream.on('error', (error) => {
            return res.status(500).json({ error: "Error downloading file" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/:id/meta', async (req, res) => {
    const { id } = req.params;

    try {
        const file = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ error: "File not found" });
        }

        res.json(file[0].metadata);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;