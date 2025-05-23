"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donateBlood = exports.donateWithWallet = exports.addWalletBalance = exports.getMyWallet = void 0;
const walletService = __importStar(require("../../infrastructure/services/WalletService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const BloodRequestModel_1 = __importDefault(require("../../infrastructure/database/models/BloodRequestModel")); // Adjust the path as needed
const getMyWallet = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const wallet = await walletService.getWalletByUserId(userId);
        res.status(200).json(wallet);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMyWallet = getMyWallet;
const addWalletBalance = async (userId, amount, purpose) => {
    try {
        const wallet = await walletService.addToWallet(userId, amount, purpose);
        return wallet;
    }
    catch (err) {
        console.log("Error adding wallet balance:", err.message);
    }
};
exports.addWalletBalance = addWalletBalance;
const donateWithWallet = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const { amount } = req.body;
        const wallet = await walletService.deductFromWallet(userId, amount, "donating");
        res.status(200).json(wallet);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.donateWithWallet = donateWithWallet;
const donateBlood = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const { location, donorId, requestId } = req.body;
        if (!location || !donorId || !requestId) {
            return res
                .status(400)
                .json({ message: "Location, donorId, and requestId are required." });
        }
        // Find and update the blood request
        const updatedRequest = await BloodRequestModel_1.default.findByIdAndUpdate(requestId, {
            status: "completed",
            donor: donorId,
            donatedAt: new Date(),
        }, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: "Donation request not found" });
        }
        res.status(200).json({
            message: "Donation confirmed and request marked as completed",
            data: updatedRequest,
        });
    }
    catch (err) {
        console.error("Error in donateBlood:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.donateBlood = donateBlood;
