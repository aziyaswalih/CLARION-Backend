"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserMongoRepository_1 = require("../infrastructure/repositories/user/UserMongoRepository");
const userRepository = new UserMongoRepository_1.UserMongoRepository();
const authMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        allowedRoles.push("admin"); // add admin role to the allowed roles
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // req.user = decoded;
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res
                    .status(403)
                    .json({ message: "Forbidden: Access denied for your role" });
            }
            const user = await userRepository.findById(decoded.id);
            if (user && !user?.isActive) {
                res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
                return res.status(403).json({ message: "Forbidden: You are blocked" });
            }
            next();
        }
        catch (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    };
};
exports.authMiddleware = authMiddleware;
