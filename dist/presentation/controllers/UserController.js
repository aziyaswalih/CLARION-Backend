"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = exports.UserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    loginUseCase;
    registerUseCase;
    otpUseCase;
    emailService;
    resetPasswordUseCase;
    AuthService;
    constructor(loginUseCase, registerUseCase, otpUseCase, emailService, resetPasswordUseCase, AuthService) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.otpUseCase = otpUseCase;
        this.emailService = emailService;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.AuthService = AuthService;
    }
    // Register User and Send OTP
    async register(req, res) {
        try {
            // Execute registration use case
            console.log(req.body);
            const { name, email, password, phone, role } = req.body;
            if (!name || !email || !password || !phone || !role)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ error: "Missing field" });
            const user = await this.registerUseCase.execute(req.body);
            console.log(user.password);
            // Generate OTP as a JWT token
            const otp = this.otpUseCase.generateOtpToken(user.email);
            console.log(otp, user.email, "usercontroller email and otp");
            // Send OTP via email
            await this.emailService.sendEmail({
                to: user.email,
                subject: "Verify Your Email",
                text: `Your OTP is: ${otp[0]}`,
            });
            res.status(httpStatus_1.HttpStatus.CREATED).json({
                success: true,
                user,
                message: "Registration successful. OTP sent to your email.",
                token: otp[1],
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
            console.log(error);
        }
    }
    // Login User
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Execute login use case
            const result = await this.loginUseCase.execute(email, password);
            if (!result) {
                return res
                    .status(httpStatus_1.HttpStatus.FORBIDDEN)
                    .json({ success: false, message: "User blocked" });
            }
            console.log(result.user);
            res.cookie("refreshToken", result.refresh_token, {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, token: result.token, user: result.user });
        }
        catch (error) {
            res
                .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                .json({ success: false, message: error.message });
        }
    }
    // Logout User
    async logout(req, res) {
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
            });
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Logged out successfully" });
        }
        catch (error) {
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: error.message });
        }
    }
    async resetPassword(req, res) {
        try {
            const { email, password } = req.body;
            await this.resetPasswordUseCase.execute(email, password);
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Password reset successfully" });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message || "Error resetting password",
            });
        }
    }
    // Resend OTP
    async resendOtp(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new Error("Email is required.");
            }
            // Generate OTP as a JWT token
            const otp = this.otpUseCase.generateOtpToken(email);
            console.log(otp, email, "usercontroller email and otp");
            // Send OTP via email
            await this.emailService.sendEmail({
                to: email,
                subject: "Resend OTP",
                text: `Your OTP is: ${otp[0]}`,
            });
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "OTP sent successfully.",
                otpToken: otp, // For debugging purposes; remove in production
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
        }
    }
    // Verify OTP
    async verifyOtp(req, res) {
        try {
            const { token, otp } = req.body;
            if (!token || !otp) {
                throw new Error("Token and OTP are required.");
            }
            console.log(token, otp, "usercontroler verify otp");
            // Verify the OTP using the OTP use case
            const isValid = await this.otpUseCase.verifyOtpToken(token, otp);
            if (!isValid) {
                throw new Error("Invalid OTP.");
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "OTP verified successfully." });
        }
        catch (error) {
            res
                .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                .json({ success: false, message: "catch from verify otp" });
        }
    }
    // Google Auth Login
    async User_Google_Auth(req, res, next) {
        try {
            console.log("Google Signin");
            const { credential } = req.body;
            console.log(credential);
            const user = await this.AuthService.execute(credential);
            const { password, ...without } = user;
            // Generate tokens (make sure you have a refresh token strategy here)
            const access_token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1D" });
            // refresh token no implemented
            const refresh_token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7D" });
            // Set refresh token in httpOnly cookie
            res.cookie("refreshToken", refresh_token, {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Send access token and user data in response
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Login success",
                token: access_token,
                user: without,
            });
        }
        catch (error) {
            console.log("error -> usercontrol -> googleSignin", error.message);
            next(error);
        }
    }
    async getUser(req, res) {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ message: "User ID is required" });
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Token is required" });
            const user = await (0, UserService_1.findUserById)(id);
            if (!user)
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ message: "User not found" });
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ message: "User retrieved successfully", user });
        }
        catch (error) {
            console.log("error -> usercontrol -> getUser", error.message);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Error retrieving user" });
        }
    }
}
exports.UserController = UserController;
const UserMongoRepository_1 = require("../../infrastructure/repositories/user/UserMongoRepository");
const httpStatus_1 = require("../../constants/httpStatus");
const UserService_1 = require("../../infrastructure/services/UserService");
const userRepository = new UserMongoRepository_1.UserMongoRepository();
const refreshTokenController = async (req, res) => {
    const token = req.cookies.refreshToken;
    console.log(req.cookies, "cookies from refresh token route");
    if (!token) {
        return res
            .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
            .json({ message: "Refresh token missing" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(payload, "payload from refresh token end point");
        const newAccessToken = jsonwebtoken_1.default.sign({ id: payload.id, role: payload.role, name: payload.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("refresh token working");
        const user = await userRepository.findById(payload.id);
        if (user && !user?.isActive) {
            res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
            return res
                .status(httpStatus_1.HttpStatus.FORBIDDEN)
                .json({ message: "Forbidden: You are blocked" });
        }
        return res.status(httpStatus_1.HttpStatus.OK).json({ token: newAccessToken });
    }
    catch (error) {
        return res
            .status(httpStatus_1.HttpStatus.FORBIDDEN)
            .json({ message: "Invalid refresh token" });
    }
};
exports.refreshTokenController = refreshTokenController;
