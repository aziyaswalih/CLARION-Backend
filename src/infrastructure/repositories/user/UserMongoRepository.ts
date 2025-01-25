import { UserModel } from "../../database/models/UserModel";
import { UserEntity } from "../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class UserMongoRepository implements IUserRepository {
  // Find a user by email
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.isActive,
      user.role,
      user.password,
      user.profilePic
    );
  }

  // Create a new user
  async create(user: UserEntity): Promise<UserEntity> {
    const userData = await UserModel.create({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      isActive: user.isActive,
      role: user.role,
      profilePic: user.profilePic,
    });
    return new UserEntity(
      userData.id,
      userData.name,
      userData.email,
      userData.phone,
      userData.isActive,
      userData.role,
      userData.password,
      userData.profilePic
    );
  }

  // Find a user by ID
  async findById(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.isActive,
      user.role,
      user.password,
      user.profilePic
    );
  }

  // Update a user's information
  async update(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return null;
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.isActive,
      user.role,
      user.password,
      user.profilePic
    );
  }

  // Soft-delete a user (mark as inactive)
  async delete(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) return null;
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.isActive,
      user.role,
      user.password,
      user.profilePic
    );
  }
}
