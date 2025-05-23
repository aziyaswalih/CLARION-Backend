"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerUseCases = void 0;
class VolunteerUseCases {
    volunteerRepo;
    constructor(volunteerRepo) {
        this.volunteerRepo = volunteerRepo;
    }
    async addVolunteer(volunteerData) {
        return await this.volunteerRepo.addVolunteer(volunteerData);
    }
    async getVolunteers() {
        return await this.volunteerRepo.getVolunteers();
    }
    async getVolunteerById(id) {
        return await this.volunteerRepo.getVolunteerById(id);
    }
    async updateVolunteer(id, updateData) {
        return await this.volunteerRepo.updateVolunteer(id, updateData);
    }
    async deleteVolunteer(id) {
        return await this.volunteerRepo.deleteVolunteer(id);
    }
}
exports.VolunteerUseCases = VolunteerUseCases;
