import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";
import bcrypt from "bcrypt";

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "admin" | "donor" | "volunteer" | "user";
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new Error("User already exists");
    console.log(data);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new UserEntity(
      "",
      data.name,
      data.email,
      data.phone,
      false,
      data.role,
      false,
      hashedPassword,
      ""
    );
    console.log(data.password, hashedPassword);
    console.log(
      "password matching success",
      await bcrypt.compare(data.password, hashedPassword)
    );

    return this.userRepository.create(newUser);
  }
}
