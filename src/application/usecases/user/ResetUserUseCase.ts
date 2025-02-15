import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import bcrypt from "bcrypt";

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, newPassword: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    return this.userRepository.update(user.id,user);
  }
}
