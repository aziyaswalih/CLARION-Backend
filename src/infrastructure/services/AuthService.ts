import { OAuth2Client } from "google-auth-library";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { UserEntity } from "../../domain/entities/UserEntity";

const client=new OAuth2Client(process.env.google_Client_ID)

export class User_Google_Auth_useCase{
    constructor(private userrepositories:IUserRepository){

    }

    async execute(token:string):Promise<UserEntity>{
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:process.env.google_Client_ID
        })
        
        const payload=ticket.getPayload()
        if(!payload || !payload.email) throw new Error("no payload")
        let user=await this.userrepositories.findByEmail(payload.email)
         console.log(user);
         
        if (!user) {
            throw new Error("User not found");
            
        }

        return user

    }
}