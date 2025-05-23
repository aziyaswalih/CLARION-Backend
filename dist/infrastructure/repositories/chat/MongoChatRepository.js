"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message_mongoRepositories = void 0;
const ChatEntity_1 = require("../../../domain/entities/ChatEntity");
const MessageModel_1 = require("../../database/models/MessageModel");
class Message_mongoRepositories {
    async findById(id) {
        const chat = await MessageModel_1.MessageModel.findById(id);
        if (!chat)
            return null;
        return new ChatEntity_1.MessageEntities(chat.id, chat.sender, chat.receiver, chat.message, chat.userType, chat.timestamp, chat.isRead, chat.attachment);
    }
    async getMessages(sender, receiver) {
        const messages = await MessageModel_1.MessageModel.find({ sender, receiver }).sort({
            timestamp: -1,
        });
        return messages.map((item) => new ChatEntity_1.MessageEntities(item.id, item.sender, item.receiver, item.message, item.userType, item.timestamp, item.isRead, item.attachment));
    }
    async markMessagesAsRead(sender, receiver) {
        await MessageModel_1.MessageModel.updateMany({ sender, receiver, isRead: false }, { isRead: true });
    }
    async getMessagesByUser(userId) {
        const messages = await MessageModel_1.MessageModel.find({
            $or: [{ sender: userId }, { receiver: userId }],
        }).sort({ timestamp: -1 });
        return messages.map((item) => new ChatEntity_1.MessageEntities(item.id, item.sender.toString(), item.receiver.toString(), item.message, item.userType, item.timestamp, item.isRead, item.attachment));
    }
    async getMessagesByVolunteer(employeeId) {
        const messages = await MessageModel_1.MessageModel.find({
            $or: [{ sender: employeeId }, { receiver: employeeId }],
        }).sort({ timestamp: -1 });
        console.log(messages, "messages by volunteer id");
        return messages.map((item) => new ChatEntity_1.MessageEntities(item.id, item.sender, item.receiver, item.message, item.userType, item.timestamp, item.isRead, item.attachment));
    }
}
exports.Message_mongoRepositories = Message_mongoRepositories;
