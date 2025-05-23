"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryMongoRepository = void 0;
const StoryModel_1 = __importDefault(require("../../database/models/StoryModel"));
class StoryMongoRepository {
    async createStory(data) {
        const story = new StoryModel_1.default(data);
        return story.save();
    }
    async findByBeneficiary(id) {
        return StoryModel_1.default.find({ beneficiary: id }).populate("beneficiary reviewedBy");
    }
    async findAll() {
        return StoryModel_1.default.find().populate("beneficiary reviewedBy");
    }
    async findById(id) {
        return StoryModel_1.default.findById(id).populate("beneficiary reviewedBy");
    }
    async updateStory(id, data) {
        return StoryModel_1.default.findByIdAndUpdate(id, data, { new: true }).populate("beneficiary reviewedBy");
    }
    async reviewStory(id, reviewerId) {
        const story = await StoryModel_1.default.findById(id);
        if (!story)
            return null;
        story.status = "processing";
        story.reviewedBy = reviewerId;
        story.reviewedAt = new Date();
        return story.save();
    }
    async rejectStory(id, reason) {
        const story = await StoryModel_1.default.findById(id);
        if (!story)
            return null;
        story.status = "rejected";
        story.reviewedAt = new Date();
        story.reason = reason;
        return story.save();
    }
}
exports.StoryMongoRepository = StoryMongoRepository;
