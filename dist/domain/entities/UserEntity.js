"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    id;
    name;
    email;
    phone;
    isActive;
    role;
    is_verified;
    password;
    profilePic;
    constructor(id, name, email, phone, isActive, role, is_verified, password, profilePic) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.isActive = isActive;
        this.role = role;
        this.is_verified = is_verified;
        this.password = password;
        this.profilePic = profilePic;
    }
}
exports.UserEntity = UserEntity;
