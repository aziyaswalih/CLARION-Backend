import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserEntity } from "../../../domain/entities/UserEntity";

export class UserUseCases {
    constructor(private userRepo: IUserRepository) {}

    async updateUser(id: string, updateData: Partial<UserEntity>): Promise<UserEntity | null> {
        return await this.userRepo.update(id, updateData)
    }

    async getUser(id: string): Promise<UserEntity | null> {
        return await this.userRepo.findById(id)
    }
}