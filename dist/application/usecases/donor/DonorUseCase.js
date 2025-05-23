"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorUseCases = void 0;
class DonorUseCases {
    donorRepo;
    constructor(donorRepo) {
        this.donorRepo = donorRepo;
    }
    async addDonor(donorData) {
        return await this.donorRepo.addDonor(donorData);
    }
    async getDonors() {
        return await this.donorRepo.getDonors();
    }
    async getDonorById(id) {
        return await this.donorRepo.getDonorById(id);
    }
    async updateDonor(id, updateData) {
        console.log("Update Data:", updateData.address);
        return await this.donorRepo.updateDonor(id, {
            ...updateData,
            address: JSON.parse(updateData.address),
        });
    }
    async deleteDonor(id) {
        return await this.donorRepo.deleteDonor(id);
    }
    async getDonationsByDonorId(donorId) {
        return await this.donorRepo.getDonationsByDonorId(donorId);
    }
    async addBloodDonation(donationData) {
        return await this.donorRepo.addBloodDonation(donationData);
    }
}
exports.DonorUseCases = DonorUseCases;
