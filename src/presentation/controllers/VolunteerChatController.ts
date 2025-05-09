import { NextFunction, Request, Response } from "express";
import { getChatByVolunteerId } from "../../application/usecases/chat/getChatByVolunteerId";
import { CustomError } from "../../utils/errors/customError";
import { AppError } from "../../utils/errors/errorEnum";


export class EmployeeChatcontroller{
    constructor(private getChatsVolunteerSide:getChatByVolunteerId) {
        
    }

    async getemployeeChat_employeeid(req:Request,res:Response,next:NextFunction){
    try {
        const {id}=req.params
        if(!id)return next(new CustomError("missing id",401,AppError.ValidationError))
        const chats=await this.getChatsVolunteerSide.execute(id)
    

        return res.status(200).json({message:"success",success:true,chats})

    } catch (error) {
        return next(error)
        
    }

    }
}