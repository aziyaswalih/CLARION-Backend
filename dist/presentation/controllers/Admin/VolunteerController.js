"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerController = void 0;
// import { VolunteerModel } from "../../infrastructure/database/models/VolunteerModel";
const UserModel_1 = require("../../../infrastructure/database/models/UserModel");
const httpStatus_1 = require("../../../constants/httpStatus");
class VolunteerController {
    async getAllVolunteers(req, res) {
        try {
            const volunteers = await UserModel_1.UserModel.find({ role: 'volunteer' });
            // console.log(volunteers);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, volunteers: volunteers });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // Edit Volunteer
    async editVolunteer(req, res) {
        const { id } = req.params;
        const updatedData = req.body;
        try {
            const volunteer = await UserModel_1.UserModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!volunteer) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, volunteer: volunteer });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    //   // Update Volunteer
    //   async updateVolunteerController(req: Request, res: Response) {
    //     const { id } = req.params;
    //     const updateData = req.body;
    //     try {
    //         const result = await updateVolunteerProfile(id, updateData);
    //         if (!result) {
    //             return res.status(HttpStatus.NOT_FOUND).json({ message: 'Volunteer not found' });
    //         }
    //         return res.status(HttpStatus.OK).json({ message: 'Volunteer profile updated', data: result });
    //     } catch (error:any) {
    //         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
    //     }
    // };
    // Block Volunteer
    async blockVolunteer(req, res) {
        const { id } = req.params;
        try {
            const volunteer = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
            if (!volunteer) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Volunteer blocked successfully', volunteer });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    } // Unblock Volunteer
    async unblockVolunteer(req, res) {
        const { id } = req.params;
        try {
            const volunteer = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
            if (!volunteer) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Volunteer unblocked successfully', volunteer });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // fetch user
    async getVolunteer(req, res) {
        const { id } = req.params;
        try {
            const volunteer = await UserModel_1.UserModel.findById(id);
            if (!volunteer) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
            }
            // console.log(volunteer);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, volunteer });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}
exports.VolunteerController = VolunteerController;
