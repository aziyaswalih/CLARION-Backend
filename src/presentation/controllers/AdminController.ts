import { Request, Response } from "express";
import { LoginAdminUseCase } from "../../application/usecases/admin/LoginAdminUseCase";

export class AdminController {
  constructor(
    private loginUseCase: LoginAdminUseCase,
  ) {}

  // Login admin
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Execute login use case
      const result = await this.loginUseCase.execute(email, password);
      console.log(result.user);
      
      res.status(200).json({ success: true, token:result.token,user:result.user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}