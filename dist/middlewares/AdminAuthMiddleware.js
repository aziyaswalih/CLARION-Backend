"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res
            .status(401)
            .json({ success: false, message: "Access token is missing" });
        return;
    }
    try {
        console.log("Reached try block in auth middleware");
        // Verify the token and assert its type
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach user info to the request object
        req.user = decoded;
        console.log(decoded, "Decoded token");
        if (decoded.role === "admin") {
            next();
        }
        else {
            res.status(403).json({ success: false, message: "Unauthorized access" });
        }
    }
    catch (error) {
        res
            .status(403)
            .json({ success: false, message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
