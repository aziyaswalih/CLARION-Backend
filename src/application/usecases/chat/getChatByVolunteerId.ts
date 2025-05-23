import { MessageEntities } from "../../../domain/entities/ChatEntity";
import { IMessageRepositories } from "../../../domain/interfaces/IChatRepository";

export class getChatByVolunteerId {
  constructor(private chatrepositories: IMessageRepositories) {}
  async execute(volunteerId: string): Promise<MessageEntities[] | null> {
    const chats = await this.chatrepositories.getMessagesByVolunteer(
      volunteerId
    );
    return chats;
  }
}
