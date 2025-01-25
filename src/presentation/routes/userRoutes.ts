import express from "express";
import { UserController } from "../controllers/UserController";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";

const router = express.Router();

const userRepository = new UserMongoRepository();
const loginUseCase = new LoginUserUseCase(userRepository);
const registerUseCase = new RegisterUserUseCase(userRepository);

const userController = new UserController(loginUseCase, registerUseCase);

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));

export default router;
