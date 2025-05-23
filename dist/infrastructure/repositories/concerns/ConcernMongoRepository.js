"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcernRepository = void 0;
const ConcernModel_1 = require("../../database/models/ConcernModel");
class ConcernRepository {
    async createConcern(concern) {
        return await ConcernModel_1.ConcernModel.create(concern);
    }
    async getAllConcerns() {
        return await ConcernModel_1.ConcernModel.find()
            .populate("reporterId", "name email")
            .populate("reportedMemberId", "name email")
            .sort({ createdAt: -1 });
    }
    async getConcernById(id) {
        return await ConcernModel_1.ConcernModel.findById(id)
            .populate("reporterId", "name email")
            .populate("reportedMemberId", "name email");
    }
    async updateConcernStatus(id, status, resolutionNote) {
        return await ConcernModel_1.ConcernModel.findByIdAndUpdate(id, { status, resolutionNote, updatedAt: new Date() }, { new: true });
    }
    async deleteConcern(id) {
        return await ConcernModel_1.ConcernModel.findByIdAndDelete(id);
    }
}
exports.ConcernRepository = ConcernRepository;
