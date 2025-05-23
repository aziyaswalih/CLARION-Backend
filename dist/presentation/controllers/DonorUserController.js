"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorController = void 0;
const DonorRepository_1 = require("../../infrastructure/repositories/donors/DonorRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DonorUseCase_1 = require("../../application/usecases/donor/DonorUseCase");
const userUseCase_1 = require("../../application/usecases/user/userUseCase");
const UserMongoRepository_1 = require("../../infrastructure/repositories/user/UserMongoRepository");
const httpStatus_1 = require("../../constants/httpStatus");
const StoryUseCase_1 = require("../../application/usecases/story/StoryUseCase");
const donorRepo = new DonorRepository_1.DonorRepository();
const donorUseCases = new DonorUseCase_1.DonorUseCases(donorRepo);
const userRepo = new UserMongoRepository_1.UserMongoRepository();
const userUseCases = new userUseCase_1.UserUseCases(userRepo);
const storyUseCases = new StoryUseCase_1.StoryUseCase();
class DonorController {
    static async addDonor(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, message: "Access token is missing" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const donor = await donorUseCases.addDonor({
                donorId: decoded.id,
                ...req.body,
            });
            res
                .status(201)
                .json({
                success: true,
                message: "Donor added successfully",
                data: donor,
            });
        }
        catch (error) {
            console.error("Error adding donor:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to add donor",
                error: error.message,
            });
        }
    }
    static async getDonors(req, res) {
        try {
            const donors = await donorUseCases.getDonors();
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Donors retrieved successfully",
                data: donors,
            });
        }
        catch (error) {
            console.error("Error fetching donors:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to fetch donors",
                error: error.message,
            });
        }
    }
    static async getDonorById(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const donor = await donorUseCases.getDonorById(decoded.id);
            const user = await userUseCases.getUser(decoded.id);
            if (!donor && !user) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Donor not found" });
            }
            else if (!donor && user) {
                const donor = donorUseCases.addDonor({ donorId: decoded.id });
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({
                    success: true,
                    message: "Donor retrieved successfully",
                    data: donor,
                });
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Donor retrieved successfully",
                data: donor,
            });
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, error: "jwt expired" });
            }
            console.error("Error fetching donor:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Error fetching profile",
                error: error.message,
            });
        }
    }
    static async updateDonor(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            let profilePicUrl;
            if (req.file) {
                console.log(req.file, "file anme");
                profilePicUrl = `/uploads/${req.file.filename}`;
            }
            console.log(profilePicUrl, "profile pic url");
            let updatedData = {
                ...req.body,
                // ,
                // ...(profilePicUrl && { profilePic: profilePicUrl })
            };
            if (profilePicUrl) {
                updatedData = { ...updatedData, profilePic: profilePicUrl };
            }
            console.log(updatedData, "updated data");
            const updatedDonor = await donorUseCases.updateDonor(decoded.id, {
                address: updatedData.address,
            });
            const updatedUser = await userUseCases.updateUser(decoded.id, updatedData);
            if (!updatedDonor || !updatedUser) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Donor not found" });
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Profile updated successfully",
                data: { updatedDonor, updatedUser },
            });
        }
        catch (error) {
            console.error("Error updating donor:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to update donor profile",
                error: error.message,
            });
        }
    }
    static async deleteDonor(req, res) {
        try {
            const deleted = await donorUseCases.deleteDonor(req.params.id);
            if (!deleted) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Donor not found" });
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Donor deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting donor:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to delete donor",
                error: error.message,
            });
        }
    }
    static async getDonationsByDonorId(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const donations = await donorUseCases.getDonationsByDonorId(decoded.id);
            if (!donations) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "No donations found" });
            }
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({
                success: true,
                message: "Donations retrieved successfully",
                data: donations,
            });
        }
        catch (error) {
            console.error("Error fetching donations:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: "Failed to fetch donations",
                error: error.message,
            });
        }
    }
    // static async addBloodDonation(req: Request, res: Response) {
    //     try {
    //         const token = req.headers.authorization?.split(" ")[1];
    //         if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });
    //         const causeId = req.body.causeId;
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    //         const bloodDonation = await donorUseCases.addBloodDonation({ storyId:causeId, donorId: decoded.id });
    //         const updateStory = await storyUseCases.updateStatus({id:causeId,status:'completed'});
    //         if (!bloodDonation) {
    //             return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Failed to add blood donation" });
    //         }
    //         if (!updateStory) {
    //             return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Failed to update story status" });
    //         }
    //         res.status(201).json({ success: true, message: "Blood donation added successfully", data: bloodDonation });
    //         return;
    //     } catch (error: any) {
    //         console.error("Error adding blood donation:", error);
    //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to add blood donation", error: error.message });
    //     }
    // }
    static async addBloodDonation(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing or invalid" });
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const { causeId } = req.body;
            if (!causeId) {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Cause ID is required" });
            }
            const bloodDonation = await donorUseCases.addBloodDonation({
                storyId: causeId,
                donorId: decoded.id,
            });
            console.log(bloodDonation, "blood donation");
            if (!bloodDonation) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Failed to add blood donation" });
            }
            const updateStory = await storyUseCases.updateStatus({
                id: causeId,
                status: "completed",
            });
            console.log(updateStory, "update story");
            if (!updateStory) {
                return res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ success: false, message: "Failed to update story status" });
            }
            return res.status(httpStatus_1.HttpStatus.CREATED).json({
                success: true,
                message: "Blood donation added successfully",
                data: bloodDonation,
            });
        }
        catch (error) {
            console.error("Error adding blood donation:", error);
            return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to add blood donation",
                error: error.message,
            });
        }
    }
}
exports.DonorController = DonorController;
