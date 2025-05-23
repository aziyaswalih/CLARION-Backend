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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class EmailService {
    transporter;
    constructor() {
        // Ensure that environment variables are available
        console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing email credentials in environment variables.");
        }
        // Create a transporter for sending emails
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail", // You can replace this with any other email provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app-specific password
            },
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates (for development only)
            },
            debug: true, // Enable debug mode (remove for production)
        });
    }
    // Method to send an email
    async sendEmail({ to, subject, text, }) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_USER, // From address
                to, // To address
                subject, // Email subject
                text, // Email content
            });
            console.log("Email sent: " + info.response);
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email.");
        }
    }
}
exports.EmailService = EmailService;
