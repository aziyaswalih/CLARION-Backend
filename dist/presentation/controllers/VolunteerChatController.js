"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeChatcontroller = void 0;
const customError_1 = require("../../utils/errors/customError");
const errorEnum_1 = require("../../utils/errors/errorEnum");
class EmployeeChatcontroller {
    getChatsVolunteerSide;
    constructor(getChatsVolunteerSide) {
        this.getChatsVolunteerSide = getChatsVolunteerSide;
    }
    async getemployeeChat_employeeid(req, res, next) {
        try {
            const { id } = req.params;
            if (!id)
                return next(new customError_1.CustomError("missing id", 401, errorEnum_1.AppError.ValidationError));
            const chats = await this.getChatsVolunteerSide.execute(id);
            return res.status(200).json({ message: "success", success: true, chats });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.EmployeeChatcontroller = EmployeeChatcontroller;
