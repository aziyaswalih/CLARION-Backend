"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeneficiaryMongoRepository = void 0;
const BeneficiaryModel_1 = require("../../database/models/BeneficiaryModel"); // Assuming you have BeneficiaryModel
class BeneficiaryMongoRepository {
    // Create a new beneficiary
    async create(beneficiary) {
        console.log(beneficiary, "beneficiary mongo repository");
        const beneficiaryData = await BeneficiaryModel_1.BeneficiaryModel.create({
            user: beneficiary.user,
            dateOfBirth: beneficiary.dateOfBirth,
            gender: beneficiary.gender,
            identificationType: beneficiary.identificationType,
            identificationNumber: beneficiary.identificationNumber,
            address: beneficiary.address,
            familyDetails: beneficiary.familyDetails,
        });
        return this.toEntity(beneficiaryData);
    }
    // Find a beneficiary by ID
    async findById(id) {
        console.log(id, "id beneficiary mongo repository");
        const beneficiary = await BeneficiaryModel_1.BeneficiaryModel.findOne({ user: id }).populate("user");
        if (!beneficiary)
            return null;
        return this.toEntity(beneficiary);
    }
    // Find all beneficiaries
    async findAll() {
        const beneficiaries = await BeneficiaryModel_1.BeneficiaryModel.find();
        return beneficiaries.map(this.toEntity);
    }
    // Update a beneficiary's information
    async update(id, updates) {
        const beneficiary = await BeneficiaryModel_1.BeneficiaryModel.findOneAndUpdate({ user: id }, updates, { new: true }).populate("user");
        if (!beneficiary)
            return null;
        return this.toEntity(beneficiary);
    }
    // Delete a beneficiary
    async delete(id) {
        const result = await BeneficiaryModel_1.BeneficiaryModel.findByIdAndDelete(id);
        return !!result; // Returns true if deletion was successful (result is not null)
    }
    // --- Helper function to map Mongoose Document to Beneficiary Entity ---
    toEntity(beneficiaryDoc) {
        return {
            id: beneficiaryDoc._id.toString(), // Convert ObjectId to string
            user: beneficiaryDoc.user,
            dateOfBirth: beneficiaryDoc.dateOfBirth,
            gender: beneficiaryDoc.gender,
            identificationType: beneficiaryDoc.identificationType,
            identificationNumber: beneficiaryDoc.identificationNumber,
            address: beneficiaryDoc.address,
            familyDetails: beneficiaryDoc.familyDetails,
            createdAt: beneficiaryDoc.createdAt,
            updatedAt: beneficiaryDoc.updatedAt,
        };
    }
}
exports.BeneficiaryMongoRepository = BeneficiaryMongoRepository;
