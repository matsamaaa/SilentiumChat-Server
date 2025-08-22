import AuthManager from "../database/managers/authManager.js";

const validateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = req.headers['x-user-id'];

    if (!token || !userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const auth = await AuthManager.isValidAuth(userId, token);
        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.token = token;
        req.user = userId;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { validateToken };
