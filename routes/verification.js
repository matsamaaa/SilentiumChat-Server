import express from 'express';
import UserManager from '../database/managers/userManager.js';
import MailchangeManager from '../database/managers/MailchangeManager.js';

const router = express.Router();

router.post('/mail/change', async (req, res) => {
    const { id, token } = req.body;

    try {
        const mailChangeRequest = await MailchangeManager.getChangeToken(id, token);
        if (!mailChangeRequest) {
            return res.status(200).json({ success: false, message: 'Invalid or expired token.' });
        }

        const user = await UserManager.updateEmail(id, mailChangeRequest.newEmail);
        if (!user) {
            return res.status(200).json({ success: false, message: 'User not found.' });
        }

        await MailchangeManager.deleteChangeToken(id, token);
        return res.status(200).json({ success: true, message: 'Email updated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'User email update failed.' });
    }
});

export default router;