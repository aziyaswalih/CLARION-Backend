"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const UserController_1 = require("../controllers/UserController");
const UserMongoRepository_1 = require("../../infrastructure/repositories/user/UserMongoRepository");
const LoginUserUseCase_1 = require("../../application/usecases/user/LoginUserUseCase");
const RegisterUserUseCase_1 = require("../../application/usecases/user/RegisterUserUseCase");
const OtpUseCase_1 = require("../../application/usecases/user/OtpUseCase");
const EmailService_1 = require("../../infrastructure/services/EmailService");
const ResetUserUseCase_1 = require("../../application/usecases/user/ResetUserUseCase");
const AuthService_1 = require("../../infrastructure/services/AuthService");
const TransactionController_1 = require("../controllers/TransactionController");
// Instantiate the necessary dependencies
const userRepository = new UserMongoRepository_1.UserMongoRepository();
const loginUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
const registerUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository);
const resetPasswordUseCase = new ResetUserUseCase_1.ResetPasswordUseCase(userRepository);
const otpUseCase = new OtpUseCase_1.OtpUseCase(userRepository);
const emailService = new EmailService_1.EmailService();
const AuthService = new AuthService_1.User_Google_Auth_useCase(userRepository);
// Instantiate the UserController with dependencies
const userController = new UserController_1.UserController(loginUseCase, registerUseCase, otpUseCase, emailService, resetPasswordUseCase, AuthService);
// Define routes
router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/logout", (req, res) => userController.logout(req, res));
router.post("/reset-password", (req, res) => userController.resetPassword(req, res));
router.post("/send-otp", (req, res) => userController.resendOtp(req, res));
router.post("/verifyOtp", (req, res) => userController.verifyOtp(req, res));
router.post("/google", (req, res, NextFunction) => userController.User_Google_Auth(req, res, NextFunction));
router.get("/refresh-token", (req, res) => (0, UserController_1.refreshTokenController)(req, res));
router.get("/transactions", (req, res) => (0, TransactionController_1.getTransactions)(req, res));
router.get("/:id", (req, res) => userController.getUser(req, res));
exports.default = router;
