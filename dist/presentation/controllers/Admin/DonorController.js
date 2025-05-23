"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorController = void 0;
const UserModel_1 = require("../../../infrastructure/database/models/UserModel");
const app_1 = require("../../../app");
const httpStatus_1 = require("../../../constants/httpStatus");
class DonorController {
    // Get all donors
    async getAllDonors(req, res) {
        try {
            const donors = await UserModel_1.UserModel.find({ role: 'donor' });
            // console.log(donors);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, donors });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // Edit Donor
    async editDonor(req, res) {
        const { id } = req.params;
        const updatedData = req.body;
        try {
            const donor = await UserModel_1.UserModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!donor) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
            }
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, donor });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async blockDonor(req, res) {
        const { id } = req.params;
        try {
            const donor = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
            if (!donor) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
                return;
            }
            // Save block status in Redis
            await app_1.redisClient.set(`blocked:${id}`, 'true');
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Donor blocked successfully', donor });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    async unblockDonor(req, res) {
        const { id } = req.params;
        try {
            const donor = await UserModel_1.UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
            if (!donor) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
                return;
            }
            // Remove block status from Redis
            await app_1.redisClient.del(`blocked:${id}`);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message: 'Donor unblocked successfully', donor });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
    // Fetch a single donor
    async getDonor(req, res) {
        const { id } = req.params;
        try {
            const donor = await UserModel_1.UserModel.findById(id);
            if (!donor) {
                res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
            }
            // console.log(donor);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, donor });
        }
        catch (error) {
            res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }
}
exports.DonorController = DonorController;
