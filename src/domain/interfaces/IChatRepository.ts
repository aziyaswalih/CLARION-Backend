import { MessageEntities } from "../entities/ChatEntity"

export interface IMessageRepositories{
    findById(id:string):Promise<MessageEntities|null>
    getMessages(sender:string,receiver:string):Promise<MessageEntities[]>
    markMessagesAsRead(sender:string,receiver:string):Promise<void>
    getMessagesByUser(userId:string):Promise<MessageEntities[]>
    getMessagesByVolunteer(employeeId:string):Promise<MessageEntities[]>
    
}