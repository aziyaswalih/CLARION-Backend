"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpEntity = void 0;
class OtpEntity {
    userId;
    otp;
    createdAt;
    expiresAt;
    constructor(userId, otp, createdAt, expiresAt) {
        this.userId = userId;
        this.otp = otp;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
    isValid() {
        return new Date() < this.expiresAt;
    }
}
exports.OtpEntity = OtpEntity;
