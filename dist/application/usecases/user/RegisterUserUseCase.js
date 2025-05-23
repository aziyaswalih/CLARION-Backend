"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const UserEntity_1 = require("../../../domain/entities/UserEntity");
const bcrypt_1 = __importDefault(require("bcrypt"));
class RegisterUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser)
            throw new Error("User already exists");
        console.log(data);
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const newUser = new UserEntity_1.UserEntity("", data.name, data.email, data.phone, true, data.role, false, hashedPassword, "");
        console.log(data.password, hashedPassword);
        console.log("password matching success", await bcrypt_1.default.compare(data.password, hashedPassword));
        return this.userRepository.create(newUser);
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
