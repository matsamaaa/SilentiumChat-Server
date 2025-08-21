import AuthManager from "../database/managers/authManager";

const validateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const auth = await AuthManager.getAuth(token);
        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.token = token;
        req.user = auth.user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserFromToken = async (token) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        req.user = null;
        next();
    }

    try {
        const auth = await AuthManager.getAuth(token);
        req.user = auth ? auth.user : null;
        next();
    } catch (error) {
        throw error;
    }
};

export { validateToken, getUserFromToken };
