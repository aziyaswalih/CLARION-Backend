import { UserEntity } from "../entities/UserEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  update(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<UserEntity | null>;
}
