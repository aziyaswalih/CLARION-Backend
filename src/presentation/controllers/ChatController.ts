import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../utils/errors/customError";
import { AppError } from "../../utils/errors/errorEnum";
import { getMessagesByBeneficiaryId } from "../../application/usecases/chat/getChatByBeneficiaryId";


export class UserChatcontroller{
    constructor(
        private getmessgesByuserSide:getMessagesByBeneficiaryId
    ) {}


    async user_getChats(req:Request,res:Response,next:NextFunction){
        try {
                const {id}=req.params
                if(!id)return next(new CustomError("id not found",401,AppError.ValidationError))

                const chats=await this.getmessgesByuserSide.execute(id)
                
                return res.status(200).json({message:"success",success:true,chats})
        
                    


        } catch (error) {
           return next(error)
            
        }
    }
    

}