"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiaryController = void 0;
// import { BeneficiaryModel } from "../../infrastructure/database/models/BeneficiaryModel";
const UserModel_1 = require("../../../infrastructure/database/models/UserModel");
const httpStatus_1 = require("../../../constants/httpStatus");
class BeneficiaryController {
    // async addBeneficiary(req: Request, res: Response): Promise<void>{
    //   try {
    //     const { name, email, phone, role } = req.body;
    //     // Check if the required fields are provided
    //     if (!name || !email || !phone || !role) {
    //       return res.status(400).json({ success: false, message: 'All fields are required.' });
    //     }
    //     // Check if the email already exists
    //     const existingUser = await UserModel.findOne({ email });
    //     if (existingUser) {
    //       return res.status(400).json({ success: false, message: 'Email is already in use.' });
    //     }
    //     // Default password
    //     const defaultPassword = 'abcd1234';
    //     const hashedPassword = await bcrypt.hash(defaultPassword, 10); // Hash the password for security
    //     req.body.password =defaultPassword
    //     // Create a new beneficiary
    //     console.log('execute avunillaa');
    //     // const user = await this.registerUseCase.execute(req.body);
    //     // Save the beneficiary to the database
    //     // await newBeneficiary.save();
    //     res.status(201).json({ success: true, message: 'Beneficiary added successfully.' });
    //   } catch (error) {
    //     console.error('Error adding beneficiary:', error);
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An error occurred. Please try again.' });
    //   }
    // };
    async getAllBeneficiaries(req, res) {
        try {
            const beneficiaries = await UserModel_1.UserModel.find({ role: 'user' });
            // console.log(beneficiaries);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, beneficiaries });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // Edit Beneficiary
    async editBeneficiary(req, res) {
        const { id } = req.params;
        const updatedData = req.body;
        try {
            const beneficiary = await UserModel_1.UserModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!beneficiary) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Beneficiary not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, beneficiary });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // Block Beneficiary
    async blockBeneficiary(req, res) {
        const { id } = req.params;
        try {
            const beneficiary = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
            if (!beneficiary) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Beneficiary not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Beneficiary blocked successfully', beneficiary });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    } // Unblock Beneficiary
    async unblockBeneficiary(req, res) {
        const { id } = req.params;
        try {
            const beneficiary = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
            if (!beneficiary) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Beneficiary not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Beneficiary unblocked successfully', beneficiary });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // fetch user
    async getBeneficiary(req, res) {
        const { id } = req.params;
        try {
            const beneficiary = await UserModel_1.UserModel.findById(id);
            if (!beneficiary) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Beneficiary not found' });
            }
            // console.log(beneficiary);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, beneficiary });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}
exports.BeneficiaryController = BeneficiaryController;
