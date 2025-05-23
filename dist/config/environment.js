"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environment = {
    dbUri: process.env.DB_URI || "mongodb://127.0.0.1:27017/CLARION",
    jwtSecret: process.env.JWT_SECRET || "aziya",
    port: process.env.PORT || 5000,
};
