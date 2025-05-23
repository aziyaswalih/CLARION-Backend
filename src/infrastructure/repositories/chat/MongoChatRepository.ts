import { MessageEntities } from "../../../domain/entities/ChatEntity";
import { IMessageRepositories } from "../../../domain/interfaces/IChatRepository";
import { MessageModel } from "../../database/models/MessageModel";

export class Message_mongoRepositories implements IMessageRepositories {
  async findById(id: string): Promise<MessageEntities | null> {
    const chat = await MessageModel.findById(id);
    if (!chat) return null;
    return new MessageEntities(
      chat.id,
      chat.sender,
      chat.receiver,
      chat.message,
      chat.userType,
      chat.timestamp,
      chat.isRead,
      chat.attachment
    );
  }
  async getMessages(
    sender: string,
    receiver: string
  ): Promise<MessageEntities[]> {
    const messages = await MessageModel.find({ sender, receiver }).sort({
      timestamp: -1,
    });
    return messages.map(
      (item) =>
        new MessageEntities(
          item.id,
          item.sender,
          item.receiver,
          item.message,
          item.userType,
          item.timestamp,
          item.isRead,
          item.attachment
        )
    );
  }
  async markMessagesAsRead(sender: string, receiver: string): Promise<void> {
    await MessageModel.updateMany(
      { sender, receiver, isRead: false },
      { isRead: true }
    );
  }
  async getMessagesByUser(userId: string): Promise<MessageEntities[]> {
    const messages = await MessageModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ timestamp: -1 });

    return messages.map(
      (item) =>
        new MessageEntities(
          item.id,
          item.sender.toString(),
          item.receiver.toString(),
          item.message,
          item.userType,
          item.timestamp,
          item.isRead,
          item.attachment
        )
    );
  }
  async getMessagesByVolunteer(employeeId: string): Promise<MessageEntities[]> {
    const messages = await MessageModel.find({
      $or: [{ sender: employeeId }, { receiver: employeeId }],
    }).sort({ timestamp: -1 });
    console.log(messages, "messages by volunteer id");

    return messages.map(
      (item) =>
        new MessageEntities(
          item.id,
          item.sender,
          item.receiver,
          item.message,
          item.userType,
          item.timestamp,
          item.isRead,
          item.attachment
        )
    );
  }
}
