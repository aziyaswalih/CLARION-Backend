import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginAdminUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {
    console.log(email, password, "login usecase execute");

    const user = await this.userRepository.findByEmail(email);
    if (!user || user.role != "admin") throw new Error("Admin not found");
    console.log(user, user.password, "hashed pass");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return { token, user };
  }
}
