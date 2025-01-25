import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return { token, user };
  }
}
