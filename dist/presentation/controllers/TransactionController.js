"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TransactionService_1 = require("../../infrastructure/services/TransactionService");
const getTransactions = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const transactions = await (0, TransactionService_1.getUserTransactions)(userId);
        res.status(200).json(transactions);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};
exports.getTransactions = getTransactions;
