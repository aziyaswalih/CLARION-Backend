import { MessageEntities } from "../../../domain/entities/ChatEntity";
import { IMessageRepositories } from "../../../domain/interfaces/IChatRepository";

export class getMessagesByBeneficiaryId{
    constructor(private messageRespositories:IMessageRepositories) {}
    async execute(userId:string):Promise<MessageEntities[]>{
      const messages=this.messageRespositories.getMessagesByUser(userId)
        return messages
    }
}