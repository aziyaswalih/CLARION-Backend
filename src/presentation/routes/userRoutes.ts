import express from "express";
const router = express.Router();

import { UserController } from "../controllers/UserController";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
import { OtpUseCase } from "../../application/usecases/user/OtpUseCase";
import { EmailService } from "../../infrastructure/services/EmailService";


// Instantiate the necessary dependencies
const userRepository = new UserMongoRepository();
const loginUseCase = new LoginUserUseCase(userRepository);
const registerUseCase = new RegisterUserUseCase(userRepository);
const otpUseCase = new OtpUseCase();
const emailService = new EmailService();

// Instantiate the UserController with dependencies
const userController = new UserController(
  loginUseCase,
  registerUseCase,
  otpUseCase,
  emailService,
  userRepository
);

// Define routes
router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/reset-password", (req, res) => userController.resetpassword(req, res));
router.post("/auth/send-otp", (req, res) => userController.resendOtp(req, res));
router.post("/verifyOtp", (req, res) => userController.verifyOtp(req, res));

export default router;
