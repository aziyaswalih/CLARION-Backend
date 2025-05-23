"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiaryUserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userUseCase_1 = require("../../application/usecases/user/userUseCase");
const UserMongoRepository_1 = require("../../infrastructure/repositories/user/UserMongoRepository");
const httpStatus_1 = require("../../constants/httpStatus");
const customError_1 = require("../../utils/errors/customError");
const errorEnum_1 = require("../../utils/errors/errorEnum");
const userRepo = new UserMongoRepository_1.UserMongoRepository();
const userUseCases = new userUseCase_1.UserUseCases(userRepo);
class BeneficiaryUserController {
    submitBeneficiaryDetailsUseCase;
    getBeneficiaryUseCase;
    listBeneficiariesUseCase;
    updateBeneficiaryUseCase;
    deleteBeneficiaryUseCase;
    constructor(submitBeneficiaryDetailsUseCase, getBeneficiaryUseCase, listBeneficiariesUseCase, updateBeneficiaryUseCase, deleteBeneficiaryUseCase) {
        this.submitBeneficiaryDetailsUseCase = submitBeneficiaryDetailsUseCase;
        this.getBeneficiaryUseCase = getBeneficiaryUseCase;
        this.listBeneficiariesUseCase = listBeneficiariesUseCase;
        this.updateBeneficiaryUseCase = updateBeneficiaryUseCase;
        this.deleteBeneficiaryUseCase = deleteBeneficiaryUseCase;
    }
    async submitDetails(req, res) {
        try {
            const beneficiaryDetails = req.body; // Assuming request body contains beneficiary details
            const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>" format
            if (!token) {
                res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Authentication token required" });
                return;
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken, beneficiaryDetails, "decoded token beneficiary details");
            const user = decodedToken.id;
            const newBeneficiary = await this.submitBeneficiaryDetailsUseCase.execute({ ...beneficiaryDetails, user: Object(user) });
            res.status(201).json(newBeneficiary); // 201 Created for successful resource creation
        }
        catch (error) {
            console.error("Error submitting beneficiary details:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                message: "Failed to submit beneficiary details",
                error: error.message,
            });
        }
    }
    async getBeneficiary(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const id = decoded.id;
            const beneficiary = await this.getBeneficiaryUseCase.execute(id);
            if (beneficiary) {
                res.status(httpStatus_1.HttpStatus.OK).json(beneficiary);
            }
            else {
                res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ message: "Beneficiary not found" });
            }
        }
        catch (error) {
            console.error("Error getting beneficiary:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to get beneficiary", error: error.message });
        }
    }
    async listBeneficiaries(req, res) {
        try {
            const beneficiaries = await this.listBeneficiariesUseCase.execute();
            res.status(httpStatus_1.HttpStatus.OK).json(beneficiaries);
        }
        catch (error) {
            console.error("Error listing beneficiaries:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                message: "Failed to list beneficiaries",
                error: error.message,
            });
        }
    }
    async updateBeneficiary(req, res) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ message: "Access token is missing" });
                return;
            }
            console.log("update beneficiary ethi");
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            let profilePicUrl = null;
            if (req.file) {
                console.log(req.file, "file from beneficiary controller");
                profilePicUrl = `/uploads/${req.file.filename}`;
            }
            // Merge the file path with other body fields
            const updatedData = {
                ...req.body,
                ...(profilePicUrl && { profilePic: profilePicUrl }),
            };
            console.log(updatedData, "updated data from beneficiary controller");
            const id = decoded.id;
            const updates = req.body; // Assuming request body contains updates
            const updatedUser = await userUseCases.updateUser(decoded.id, updatedData);
            const updatedBeneficiary = await this.updateBeneficiaryUseCase.execute(id, {
                ...updates,
                address: JSON.parse(updatedData.address),
                familyDetails: JSON.parse(updatedData.familyDetails),
            });
            if (updatedBeneficiary) {
                res.status(httpStatus_1.HttpStatus.OK).json(updatedBeneficiary);
            }
            else {
                res
                    .status(httpStatus_1.HttpStatus.NOT_FOUND)
                    .json({ message: "Beneficiary not found for update" });
            }
        }
        catch (error) {
            console.error("Error updating beneficiary:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                message: "Failed to update beneficiary",
                error: error.message,
            });
        }
    }
    async deleteBeneficiary(req, res) {
        try {
            const id = req.params.id;
            await this.deleteBeneficiaryUseCase.execute(id);
            res.status(httpStatus_1.HttpStatus.NO_CONTENT).send(); // 204 No Content for successful deletion
        }
        catch (error) {
            console.error("Error deleting beneficiary:", error);
            res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                message: "Failed to delete beneficiary",
                error: error.message,
            });
        }
    }
    async User_get_volunteerdetailsControl(req, res, next) {
        try {
            const { id } = req.params;
            if (!id)
                return next(new customError_1.CustomError("id missing", 401, errorEnum_1.AppError.ValidationError));
            const user = await this.execute(id);
            const { password: _, ...without } = user;
            return res.status(200).json({ message: "success", user: without });
        }
        catch (error) {
            return next(error);
        }
    }
    async execute(id) {
        const volunteer = await userUseCases.getUser(id);
        if (!volunteer)
            throw new Error("No employee");
        return volunteer;
    }
}
exports.BeneficiaryUserController = BeneficiaryUserController;
