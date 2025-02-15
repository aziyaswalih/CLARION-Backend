import { BeneficiaryModel } from "../../database/models/BeneficiaryModel"; // Assuming you have BeneficiaryModel
import { Beneficiary } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryRepository } from "../../../domain/interfaces/IBeneficiaryRepository";

export class BeneficiaryMongoRepository implements BeneficiaryRepository {
    // Create a new beneficiary
    async create(beneficiary: Beneficiary): Promise<Beneficiary> {
        const beneficiaryData = await BeneficiaryModel.create({
            details: beneficiary.details,
            condition: beneficiary.condition,
            dateOfBirth: beneficiary.dateOfBirth,
            gender: beneficiary.gender,
            identificationType: beneficiary.identificationType,
            identificationNumber: beneficiary.identificationNumber,
            address: beneficiary.address,
            familyDetails: beneficiary.familyDetails,
            uploadedFiles: beneficiary.uploadedFiles,
        });
        return this.toEntity(beneficiaryData);
    }

    // Find a beneficiary by ID
    async findById(id: string): Promise<Beneficiary | null> {
        const beneficiary = await BeneficiaryModel.findById(id);
        if (!beneficiary) return null;
        return this.toEntity(beneficiary);
    }

    // Find all beneficiaries
    async findAll(): Promise<Beneficiary[]> {
        const beneficiaries = await BeneficiaryModel.find();
        return beneficiaries.map(this.toEntity);
    }

    // Update a beneficiary's information
    async update(id: string, updates: Partial<Beneficiary>): Promise<Beneficiary | null> {
        const beneficiary = await BeneficiaryModel.findByIdAndUpdate(id, updates, { new: true });
        if (!beneficiary) return null;
        return this.toEntity(beneficiary);
    }

    // Delete a beneficiary
    async delete(id: string): Promise<boolean> {
        const result = await BeneficiaryModel.findByIdAndDelete(id);
        return !!result; // Returns true if deletion was successful (result is not null)
    }

    // --- Helper function to map Mongoose Document to Beneficiary Entity ---
    private toEntity(beneficiaryDoc: any): Beneficiary {
        return {
            id: beneficiaryDoc._id.toString(), // Convert ObjectId to string
            details: beneficiaryDoc.details,
            condition: beneficiaryDoc.condition,
            dateOfBirth: beneficiaryDoc.dateOfBirth,
            gender: beneficiaryDoc.gender,
            identificationType: beneficiaryDoc.identificationType,
            identificationNumber: beneficiaryDoc.identificationNumber,
            address: beneficiaryDoc.address,
            familyDetails: beneficiaryDoc.familyDetails,
            uploadedFiles: beneficiaryDoc.uploadedFiles,
            createdAt: beneficiaryDoc.createdAt,
            updatedAt: beneficiaryDoc.updatedAt,
        };
    }
}