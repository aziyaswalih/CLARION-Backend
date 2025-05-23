"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenEntity = void 0;
class AuthTokenEntity {
    token;
    expiresAt;
    userId;
    constructor(token, expiresAt, userId) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.userId = userId;
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
}
exports.AuthTokenEntity = AuthTokenEntity;
