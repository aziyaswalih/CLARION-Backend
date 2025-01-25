import { Request, Response } from "express";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";

export class UserController {
  constructor(private loginUseCase: LoginUserUseCase, private registerUseCase: RegisterUserUseCase) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, user:user,message:"Registration succesfull" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}
