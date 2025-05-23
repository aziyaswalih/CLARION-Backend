"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Google_Auth_useCase = void 0;
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.google_Client_ID);
class User_Google_Auth_useCase {
    userrepositories;
    constructor(userrepositories) {
        this.userrepositories = userrepositories;
    }
    async execute(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.google_Client_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            throw new Error("no payload");
        let user = await this.userrepositories.findByEmail(payload.email);
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
exports.User_Google_Auth_useCase = User_Google_Auth_useCase;
