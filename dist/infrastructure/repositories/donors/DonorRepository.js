"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorRepository = void 0;
const DonorModel_1 = __importDefault(require("../../../infrastructure/database/models/DonorModel"));
const DonationModel_1 = __importDefault(require("../../database/models/DonationModel"));
class DonorRepository {
    async addDonor(donor) {
        const newDonor = new DonorModel_1.default(donor);
        return await newDonor.save();
    }
    async getDonors() {
        return await DonorModel_1.default.find();
    }
    async getDonorById(id) {
        return await DonorModel_1.default.findOne({ donorId: id }).populate("donorId");
    }
    async updateDonor(id, updateData) {
        return await DonorModel_1.default.findOneAndUpdate({ donorId: id }, updateData, {
            new: true,
        });
    }
    async deleteDonor(id) {
        const result = await DonorModel_1.default.findByIdAndDelete(id);
        return !!result;
    }
    async getDonationsByDonorId(donorId) {
        const donations = await DonationModel_1.default.find({ donorId: donorId })
            .populate("storyId")
            .sort({ date: -1 });
        if (!donations)
            return [];
        return donations;
    }
    async addBloodDonation(donationData) {
        const newDonation = new DonationModel_1.default(donationData);
        return await newDonation.save();
    }
}
exports.DonorRepository = DonorRepository;
