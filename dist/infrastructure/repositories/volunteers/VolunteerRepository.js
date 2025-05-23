"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerRepository = void 0;
const VolunteerModel_1 = __importDefault(require("../../../infrastructure/database/models/VolunteerModel"));
class VolunteerRepository {
    async addVolunteer(volunteer) {
        const newVolunteer = new VolunteerModel_1.default(volunteer);
        return await newVolunteer.save();
    }
    async getVolunteers() {
        return await VolunteerModel_1.default.find();
    }
    async getVolunteerById(id) {
        return await VolunteerModel_1.default.findOne({ volunteerId: id }).populate("volunteerId");
    }
    async updateVolunteer(id, updateData) {
        return await VolunteerModel_1.default.findOneAndUpdate({ volunteerId: id }, updateData, { new: true });
    }
    async deleteVolunteer(id) {
        const result = await VolunteerModel_1.default.findByIdAndDelete(id);
        return !!result;
    }
}
exports.VolunteerRepository = VolunteerRepository;
