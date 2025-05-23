"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAdminUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginAdminUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        console.log(email, password, "login usecase execute");
        const user = await this.userRepository.findByEmail(email);
        if (!user || user.role != "admin")
            throw new Error("Admin not found");
        console.log(user, user.password, "hashed pass");
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { token, user };
    }
}
exports.LoginAdminUseCase = LoginAdminUseCase;
