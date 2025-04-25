import { IVolunteerRepository } from "../../../domain/interfaces/IVolunteerRepository";
import { Volunteer } from "../../../domain/entities/VolunteerEntity";

export class VolunteerUseCases {
    constructor(private volunteerRepo: IVolunteerRepository) {}

    async addVolunteer(volunteerData: Volunteer): Promise<Volunteer> {
        return await this.volunteerRepo.addVolunteer(volunteerData);
    }

    async getVolunteers(): Promise<Volunteer[]> {
        return await this.volunteerRepo.getVolunteers();
    }

    async getVolunteerById(id: string): Promise<Volunteer | null> {
        return await this.volunteerRepo.getVolunteerById(id);
    }

    async updateVolunteer(id: string, updateData: Partial<Volunteer>): Promise<Volunteer | null> {
        return await this.volunteerRepo.updateVolunteer(id, updateData);
    }

    async deleteVolunteer(id: string): Promise<boolean> {
        return await this.volunteerRepo.deleteVolunteer(id);
    }
}
