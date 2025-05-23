"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class OtpUseCase {
    userRepository;
    jwtSecret;
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.jwtSecret = process.env.JWT_SECRET || "your_secret_key";
    }
    // Generate an OTP JWT
    generateOtpToken(email) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresIn = "10m"; // OTP expires in 10 minutes
        const token = jsonwebtoken_1.default.sign({ email, otp }, this.jwtSecret, { expiresIn });
        console.log(`OTP for ${email}: ${otp}`); // Log the OTP for testing
        return [otp, token];
    }
    // Verify an OTP JWT
    async verifyOtpToken(token, otp) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            console.log(decoded, decoded.otp, otp, "otp usecase");
            const user = await this.userRepository.findByEmail(decoded.email);
            if (decoded.otp === otp && user) {
                console.log(user, "user from otpusecase");
                this.userRepository.update(user.id, { is_verified: true });
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new Error("Invalid or expired OTP.");
        }
    }
}
exports.OtpUseCase = OtpUseCase;
