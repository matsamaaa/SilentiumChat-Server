import express from 'express';
import MailValidator from '../utils/validations/mail.js';
import PasswordValidator from '../utils/validations/password.js';
import UserManager from '../database/managers/userManager.js';
import AuthManager from '../database/managers/authManager.js';
import FriendManager from '../database/managers/friendManager.js';
import PrivateDiscussionManager from '../database/managers/privateDiscussionManager.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, tag, password, passwordConfirmation, publicKey } = req.body;

    if (!MailValidator.validateEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (await UserManager.getUserByEmail(email)) {
        return res.status(400).json({ success: false, message: "Email already in use" });
    }

    if (await UserManager.getUserByFullUsername(username, tag)) {
        return res.status(400).json({ success: false, message: "Username and tag already in use" });
    }

    if (!PasswordValidator.isValidPassword(password)) {
        return res.status(400).json({ success: false, message: "Invalid password format" });
    }

    if (!PasswordValidator.isSamePassword(password, passwordConfirmation)) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (!publicKey || typeof publicKey !== 'string') {
        return res.status(400).json({ success: false, message: "Invalid public key" });
    }

    try {
        const user = await UserManager.createUser({ email, username, tag, password, publicKey });
        const auth = await AuthManager.createAuth(user.uniqueId);
        return res.status(201).json({ 
            success: true, 
            message: "User registered successfully", 
            datas: {
                token: auth.token, 
                user: user 
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!MailValidator.validateEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    try {
        // check if user exists
        const user = await UserManager.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isFakePassword = await bcrypt.compare(password, user.fakePassword);
        // compare hashed password and password
        if (!await bcrypt.compare(password, user.password) && !isFakePassword) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // check if user has auth
        const hasAuth = await AuthManager.hasAuth(user.uniqueId);
        if (hasAuth) {
            // delete it to create a new auth
            await AuthManager.deleteAuth(user.uniqueId);
        }

        if (isFakePassword) {
            await FriendManager.cleanupFriendsList(user.uniqueId);
            await UserManager.deletePublicKey(user.uniqueId);
            await PrivateDiscussionManager.deleteAllDiscussions(user.uniqueId);
            await UserManager.deleteAvatar(user.uniqueId);
        }

        // create new auth
        const auth = await AuthManager.createAuth(user.uniqueId);
        return res.status(200).json({ 
            success: true,
            message: "Login successful", 
            datas: {
                token: auth.token, user: user 
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
})

export default router;