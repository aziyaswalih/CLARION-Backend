"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserChatcontroller = void 0;
const customError_1 = require("../../utils/errors/customError");
const errorEnum_1 = require("../../utils/errors/errorEnum");
class UserChatcontroller {
    getmessgesByuserSide;
    constructor(getmessgesByuserSide) {
        this.getmessgesByuserSide = getmessgesByuserSide;
    }
    async user_getChats(req, res, next) {
        try {
            const { id } = req.params;
            if (!id)
                return next(new customError_1.CustomError("id not found", 401, errorEnum_1.AppError.ValidationError));
            const chats = await this.getmessgesByuserSide.execute(id);
            return res.status(200).json({ message: "success", success: true, chats });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UserChatcontroller = UserChatcontroller;
