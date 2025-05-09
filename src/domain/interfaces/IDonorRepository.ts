import { Donor } from "../entities/DonorEntity";

export interface IDonorRepository {
    addDonor(donor: Donor): Promise<Donor>;
    getDonors(): Promise<Donor[]>;
    getDonorById(id: string): Promise<Donor | null>;
    updateDonor(id: string, updateData: Partial<Donor>): Promise<Donor | null>;
    deleteDonor(id: string): Promise<boolean>;
    getDonationsByDonorId(donorId: string): Promise<any[]>;
    addBloodDonation(donationData: any): Promise<any>;
}
