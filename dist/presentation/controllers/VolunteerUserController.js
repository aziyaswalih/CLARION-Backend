"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerController = void 0;
const VolunteerRepository_1 = require("../../infrastructure/repositories/volunteers/VolunteerRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const VolunteerUseCase_1 = require("../../application/usecases/volunteer/VolunteerUseCase");
const userUseCase_1 = require("../../application/usecases/user/userUseCase");
const UserMongoRepository_1 = require("../../infrastructure/repositories/user/UserMongoRepository");
const httpStatus_1 = require("../../constants/httpStatus");
const volunteerRepo = new VolunteerRepository_1.VolunteerRepository();
const volunteerUseCases = new VolunteerUseCase_1.VolunteerUseCases(volunteerRepo);
const userRepo = new UserMongoRepository_1.UserMongoRepository();
const userUseCases = new userUseCase_1.UserUseCases(userRepo);
class VolunteerController {
    static async addVolunteer(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, message: "Access token is missing" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const volunteer = await volunteerUseCases.addVolunteer({
                volunteerId: decoded.id,
                ...req.body,
            });
            res
                .status(httpStatus_1.HttpStatus.CREATED)
                .json({
                success: true,
                message: "Volunteer added successfully",
                data: volunteer,
            });
        }
        catch (error) {
            console.error("Error adding volunteer:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to add volunteer",
                error: error.message,
            });
        }
    }
    static async getVolunteers(req, res) {
        try {
            const volunteers = await volunteerUseCases.getVolunteers();
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Volunteers retrieved successfully",
                data: volunteers,
            });
        }
        catch (error) {
            console.error("Error fetching volunteers:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to fetch volunteers",
                error: error.message,
            });
        }
    }
    static async getVolunteerById(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // console.log(decoded,'decoded');
            // if (decoded.error.name === 'TokenExpiredError'){
            //     return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: 'jwt expired' });
            // }
            const volunteer = await volunteerUseCases.getVolunteerById(decoded.id);
            if (!volunteer) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Volunteer not found" });
            }
            // console.log(volunteer,'volunteer & user from volunteerusercontroller');
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Volunteer retrieved successfully",
                data: volunteer,
            });
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, error: "jwt expired" });
            }
            console.error("Error fetching volunteer:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Error fetching profile",
                error: error.message,
            });
        }
    }
    static async updateVolunteer(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            let profilePicUrl;
            if (req.file) {
                profilePicUrl = `/uploads/${req.file.filename}`;
            }
            // Merge the file path with other body fields
            const updatedData = {
                ...req.body,
                ...(profilePicUrl && { profilePic: profilePicUrl }),
            };
            const updatedVolunteer = await volunteerUseCases.updateVolunteer(decoded.id, updatedData);
            const updatedUser = await userUseCases.updateUser(decoded.id, updatedData);
            if (!updatedVolunteer || !updatedUser) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Volunteer not found" });
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Profile updated successfully",
                data: { updatedVolunteer, updatedUser },
            });
        }
        catch (error) {
            console.error("Error updating volunteer:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to update volunteer profile",
                error: error.message,
            });
        }
    }
    static async deleteVolunteer(req, res) {
        try {
            const deleted = await volunteerUseCases.deleteVolunteer(req.params.id);
            if (!deleted) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Volunteer not found" });
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Volunteer deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting volunteer:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to delete volunteer",
                error: error.message,
            });
        }
    }
}
exports.VolunteerController = VolunteerController;
