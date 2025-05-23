import { ConcernModel, IConcern } from "../../database/models/ConcernModel";

export class ConcernRepository {
  async createConcern(concern: IConcern) {
    return await ConcernModel.create(concern);
  }

  async getAllConcerns() {
    return await ConcernModel.find()
      .populate("reporterId", "name email")
      .populate("reportedMemberId", "name email")
      .sort({ createdAt: -1 });
  }

  async getConcernById(id: string) {
    return await ConcernModel.findById(id)
      .populate("reporterId", "name email")
      .populate("reportedMemberId", "name email");
  }

  async updateConcernStatus(
    id: string,
    status: IConcern["status"],
    resolutionNote?: string
  ) {
    return await ConcernModel.findByIdAndUpdate(
      id,
      { status, resolutionNote, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteConcern(id: string) {
    return await ConcernModel.findByIdAndDelete(id);
  }
}
