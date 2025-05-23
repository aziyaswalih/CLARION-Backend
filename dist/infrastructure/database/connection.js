"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const mongoURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/charity";
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected successfully.");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process on connection failure
    }
};
exports.connectDB = connectDB;
