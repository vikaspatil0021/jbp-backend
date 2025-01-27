import jwt from "jsonwebtoken";

export default function authenticateUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: "unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token." });
    }
};


