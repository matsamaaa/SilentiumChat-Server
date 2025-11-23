import express from "express";
import constructMail from "../utils/mail/constructor.js";
import sendMail from "../utils/mail/sender.js";
import UserManager from "../database/managers/userManager.js";
import ResetTokenManager from "../database/managers/resetManager.js";
import MailManager from "../database/managers/resetManager.js";

const router = express.Router();

router.post('/password/reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserManager.getUserByEmail(email);
        if (!user) return res.status(404).json({ success: false, message: "User with this email does not exist" });

        const hasAlresadySent = await MailManager.hasResetToken(user.uniqueId);
        if (hasAlresadySent) {
            return res.status(429).json({ success: false, message: "A reset password mail has already been sent recently. Please check your inbox." });
        }

        const token = await ResetTokenManager.createResetToken(user.uniqueId);
        if(!token) {
            return res.status(500).json({ success: false, message: "Error creating reset token" });
        }

        // create html doc with informations
        const resetUrl = `${process.env.FRONTEND_URL}/password/reset?token=${token.resetToken}&id=${user.uniqueId}`;

        // send document to user email
        const templateVariables = {
            username: user.username,
            resetUrl: resetUrl,
        };

        const html = await constructMail('password', 'reset', templateVariables);
        if (!html) {
            return res.status(500).json({ success: false, message: "Error constructing reset password mail" });
        }
        console.log("Sending mail to:", email);
        const mail = await sendMail(email, "SilentiumChat - Password Reset", html);
        if (!mail) {
            return res.status(500).json({ success: false, message: "Error sending reset password mail" });
        }

        return res.status(200).json({ success: true, message: "Reset password mail sent successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error sending reset password mail" });
    }
});

export default router;