import { Volunteer } from "../entities/VolunteerEntity";

export interface IVolunteerRepository {
    addVolunteer(volunteer: Volunteer): Promise<Volunteer>;
    getVolunteers(): Promise<Volunteer[]>;
    getVolunteerById(id: string): Promise<Volunteer | null>;
    updateVolunteer(id: string, updateData: Partial<Volunteer>): Promise<Volunteer | null>;
    deleteVolunteer(id: string): Promise<boolean>;
}
