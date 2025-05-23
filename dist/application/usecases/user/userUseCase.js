"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCases = void 0;
class UserUseCases {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async updateUser(id, updateData) {
        console.log("Update Data from userusecase :", updateData, id);
        return await this.userRepo.update(id, updateData);
    }
    async getUser(id) {
        return await this.userRepo.findById(id);
    }
}
exports.UserUseCases = UserUseCases;
