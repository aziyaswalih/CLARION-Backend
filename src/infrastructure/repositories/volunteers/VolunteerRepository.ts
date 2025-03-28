import VolunteerModel, { VolunteerDocument } from "../../../infrastructure/database/models/VolunteerModel";
import { IVolunteerRepository } from "../../../domain/interfaces/IVolunteerRepository";
import { Volunteer } from "../../../domain/entities/VolunteerEntity";

export class VolunteerRepository implements IVolunteerRepository {
    async addVolunteer(volunteer: Volunteer): Promise<Volunteer> {
        const newVolunteer = new VolunteerModel(volunteer);
        return await newVolunteer.save();
    }

    async getVolunteers(): Promise<Volunteer[]> {
        return await VolunteerModel.find();
    } 

    async getVolunteerById(id: string): Promise<Volunteer | null> {
        return await VolunteerModel.findOne({volunteerId:id}).populate('volunteerId')
    }

    async updateVolunteer(id: string, updateData: Partial<Volunteer>): Promise<Volunteer | null> {
        return await VolunteerModel.findOneAndUpdate({volunteerId: id}, updateData, { new: true });
    }

    async deleteVolunteer(id: string): Promise<boolean> {
        const result = await VolunteerModel.findByIdAndDelete(id);
        return !!result;
    }
}
