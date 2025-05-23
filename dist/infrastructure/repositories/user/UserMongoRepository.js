"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMongoRepository = void 0;
const UserModel_1 = require("../../database/models/UserModel");
const UserEntity_1 = require("../../../domain/entities/UserEntity");
class UserMongoRepository {
    // Find a user by email
    async findByEmail(email) {
        const user = await UserModel_1.UserModel.findOne({ email });
        if (!user)
            return null;
        return new UserEntity_1.UserEntity(user.id, user.name, user.email, user.phone, user.isActive, user.role, user.is_verified, user.password, user.profilePic);
    }
    // Create a new user
    async create(user) {
        const userData = await UserModel_1.UserModel.create({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            isActive: user.isActive,
            role: user.role,
            profilePic: user.profilePic,
        });
        return new UserEntity_1.UserEntity(userData.id, userData.name, userData.email, userData.phone, userData.isActive, userData.role, userData.is_verified, userData.password, userData.profilePic);
    }
    // Find a user by ID
    async findById(id) {
        const user = await UserModel_1.UserModel.findById(id);
        if (!user)
            return null;
        return new UserEntity_1.UserEntity(user.id, user.name, user.email, user.phone, user.isActive, user.role, user.is_verified, user.password, user.profilePic);
    }
    // Update a user's information
    async update(id, updates) {
        const user = await UserModel_1.UserModel.findByIdAndUpdate(id, updates, { new: true });
        if (!user)
            return null;
        return new UserEntity_1.UserEntity(user.id, user.name, user.email, user.phone, user.isActive, user.role, user.is_verified, user.password, user.profilePic);
    }
    // Soft-delete a user (mark as inactive)
    async delete(id) {
        const user = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user)
            return null;
        return new UserEntity_1.UserEntity(user.id, user.name, user.email, user.phone, user.isActive, user.role, user.is_verified, user.password, user.profilePic);
    }
}
exports.UserMongoRepository = UserMongoRepository;
