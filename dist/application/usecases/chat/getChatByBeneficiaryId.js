"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesByBeneficiaryId = void 0;
class getMessagesByBeneficiaryId {
    messageRespositories;
    constructor(messageRespositories) {
        this.messageRespositories = messageRespositories;
    }
    async execute(userId) {
        const messages = this.messageRespositories.getMessagesByUser(userId);
        return messages;
    }
}
exports.getMessagesByBeneficiaryId = getMessagesByBeneficiaryId;
