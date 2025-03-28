import DonorModel, { DonorDocument } from "../../../infrastructure/database/models/DonorModel";
import { IDonorRepository } from "../../../domain/interfaces/IDonorRepository";
import { Donor } from "../../../domain/entities/DonorEntity";

export class DonorRepository implements IDonorRepository {
    async addDonor(donor: Donor): Promise<Donor> {
        const newDonor = new DonorModel(donor);
        return await newDonor.save();
    }

    async getDonors(): Promise<Donor[]> {
        return await DonorModel.find();
    }

    async getDonorById(id: string): Promise<Donor | null> {
        return await DonorModel.findOne({ donorId: id }).populate('donorId');
    }

    async updateDonor(id: string, updateData: Partial<Donor>): Promise<Donor | null> {
        return await DonorModel.findOneAndUpdate({ donorId: id }, updateData, { new: true });
    }

    async deleteDonor(id: string): Promise<boolean> {
        const result = await DonorModel.findByIdAndDelete(id);
        return !!result;
    }
}
