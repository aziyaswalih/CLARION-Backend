"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatByVolunteerId = void 0;
class getChatByVolunteerId {
    chatrepositories;
    constructor(chatrepositories) {
        this.chatrepositories = chatrepositories;
    }
    async execute(volunteerId) {
        const chats = await this.chatrepositories.getMessagesByVolunteer(volunteerId);
        return chats;
    }
}
exports.getChatByVolunteerId = getChatByVolunteerId;
