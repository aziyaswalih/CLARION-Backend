import { IDonorRepository } from "../../../domain/interfaces/IDonorRepository";
import { Donor } from "../../../domain/entities/DonorEntity";

export class DonorUseCases {
    constructor(private donorRepo: IDonorRepository) {}

    async addDonor(donorData: Donor): Promise<Donor> {
        return await this.donorRepo.addDonor(donorData);
    }

    async getDonors(): Promise<Donor[]> {
        return await this.donorRepo.getDonors();
    }

    async getDonorById(id: string): Promise<Donor | null> {
        return await this.donorRepo.getDonorById(id);
    }

    async updateDonor(id: string, updateData: Partial<Donor>): Promise<Donor | null> {
        console.log("Update Data:", updateData.address);
        
        return await this.donorRepo.updateDonor(id, {...updateData, address: JSON.parse(updateData.address as string)});
    }

    async deleteDonor(id: string): Promise<boolean> {
        return await this.donorRepo.deleteDonor(id);
    }

    async getDonationsByDonorId(donorId: string): Promise<any[]> {
        return await this.donorRepo.getDonationsByDonorId(donorId);
    }
}
