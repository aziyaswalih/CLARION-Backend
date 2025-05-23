"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class ResetPasswordUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, newPassword) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new Error("User not found");
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        return this.userRepository.update(user.id, user);
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
