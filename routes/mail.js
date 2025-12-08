import express from "express";
import constructMail from "../utils/mail/constructor.js";
import sendMail from "../utils/mail/sender.js";
import UserManager from "../database/managers/userManager.js";
import ResetTokenManager from "../database/managers/resetManager.js";
import MailManager from "../database/managers/resetManager.js";
import PasswordValidator from "../utils/validations/password.js";
import { validateToken } from '../middleware/auth.js';
import bcrypt from "bcrypt";
import MailchangeManager from "../database/managers/mailchangeManager.js";

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

router.post('/password/change', async (req, res) => {
    const { id, token, currentPassword, passwordConfirmation } = req.body;

    try {
        const resetSession = await ResetTokenManager.getResetToken(id, token);
        if (!resetSession) {
            return res.status(400).json({ success: false, message: "Your session has expired" });
        }

        if (!PasswordValidator.isSamePassword(currentPassword, passwordConfirmation)) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        if (!PasswordValidator.isValidPassword(currentPassword)) {
            return res.status(400).json({ success: false, message: "Password does not meet the required criteria" });
        }

        const updated = await UserManager.updatePassword(id, currentPassword);
        if (!updated) {
            return res.status(500).json({ success: false, message: "Error updating user password" });
        }

        const templateVariables = {
            username: updated.username,
            resetDate: new Date().toLocaleString(),
        };

        const html = await constructMail('password', 'changed', templateVariables);
        if (!html) {
            return res.status(500).json({ success: false, message: "Error constructing reset password mail" });
        }

        const mail = await sendMail(updated.email, "SilentiumChat - Password Changed", html);
        if (!mail) {
            return res.status(500).json({ success: false, message: "Error sending password changed confirmation mail" });
        }

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error resetting user password" });
    }
})

router.post('/email/change', validateToken, async (req, res) => {
    const { id, newEmail, password } = req.body;

    try {
        const user = await UserManager.getUserById(id);
        if (!user) return res.status(404).json({ success: false, message: "User does not exist" });

        // compare hashed password and password
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        const hasAlresadySent = await MailchangeManager.hasChangeToken(user.uniqueId);
        if (hasAlresadySent) {
            return res.status(429).json({ success: false, message: "A change email mail has already been sent recently. Please check your inbox." });
        }

        const token = await MailchangeManager.createChangeToken(user.uniqueId, newEmail);
        if(!token) {
            return res.status(500).json({ success: false, message: "Error creating change email token" });
        }

        const changeUrl = `${process.env.FRONTEND_URL}/verification/mail?token=${token.mailchangeToken}&id=${user.uniqueId}`;
        const templateVariables = {
            username: user.username,
            oldEmail: user.email,
            newEmail: newEmail,
            changeUrl: changeUrl
        };

        const html = await constructMail('email', 'change', templateVariables);
        if (!html) {
            return res.status(500).json({ success: false, message: "Error constructing change email mail" });
        }

        const mail = await sendMail(newEmail, "SilentiumChat - Email Change Confirmation", html);
        if (!mail) {
            return res.status(500).json({ success: false, message: "Error sending change email mail" });
        }

        return res.status(200).json({ success: true, message: "Change email mail sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error sending change email mail" });
    }
});

export default router;