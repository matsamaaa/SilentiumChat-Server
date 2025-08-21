import express from 'express';
import MailValidator from '../utils/validations/mail';
import PasswordValidator from '../utils/validations/password';
import UserManager from '../database/managers/userManager';
import AuthManager from '../database/managers/authManager';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, tag, password, passwordConfirmation, publicKey } = req.body;

    if (!MailValidator.validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (await UserManager.getUserByEmail(email)) {
        return res.status(400).json({ message: "Email already in use" });
    }

    if (await UserManager.getUserByFullUsername(username, tag)) {
        return res.status(400).json({ message: "Username and tag already in use" });
    }

    if (!PasswordValidator.isValidPassword(password)) {
        return res.status(400).json({ message: "Invalid password format" });
    }

    if (!PasswordValidator.isSamePassword(password, passwordConfirmation)) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const user = await UserManager.createUser({ email, username, tag, password, publicKey });
        const auth = await AuthManager.createAuth(user.uniqueId);
        return res.status(201).json({ message: "User registered successfully", token: auth.token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
