import express from "express";
const router = express.Router();

import { refreshTokenController, UserController } from "../controllers/UserController";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
import { OtpUseCase } from "../../application/usecases/user/OtpUseCase";
import { EmailService } from "../../infrastructure/services/EmailService";
import { ResetPasswordUseCase } from "../../application/usecases/user/ResetUserUseCase";
import {User_Google_Auth_useCase} from '../../infrastructure/services/AuthService'
import { getTransactions } from "../controllers/TransactionController";

// Instantiate the necessary dependencies
const userRepository = new UserMongoRepository();
const loginUseCase = new LoginUserUseCase(userRepository);
const registerUseCase = new RegisterUserUseCase(userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);
const otpUseCase = new OtpUseCase(userRepository);
const emailService = new EmailService();
const AuthService = new User_Google_Auth_useCase(userRepository);

// Instantiate the UserController with dependencies
const userController = new UserController(
  loginUseCase,
  registerUseCase,
  otpUseCase,
  emailService,
  resetPasswordUseCase,
  AuthService
);

// Define routes
router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/logout", (req, res) => userController.logout(req, res));
router.post("/reset-password", (req, res) => userController.resetPassword(req, res));
router.post("/send-otp", (req, res) => userController.resendOtp(req, res));
router.post("/verifyOtp", (req, res) => userController.verifyOtp(req, res));
router.post("/google", (req, res,  NextFunction) => userController.User_Google_Auth(req, res, NextFunction))
router.get('/refresh-token',(req,res)=> refreshTokenController(req,res))
router.get("/transactions", (req, res) => getTransactions(req, res));
export default router;
