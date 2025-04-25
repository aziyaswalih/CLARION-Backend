import StoryModel from "../../database/models/StoryModel";
import { IStory } from "../../database/models/StoryModel";
import { IStoryRepository } from "../../../domain/interfaces/IStoryRepository";

export class StoryMongoRepository implements IStoryRepository {
  async createStory(data: Partial<IStory>): Promise<IStory> {
    const story = new StoryModel(data);
    return story.save();
  }

  async findByBeneficiary(id: string): Promise<IStory[]> {
    return StoryModel.find({ beneficiary: id }).populate("beneficiary reviewedBy");
  }

  async findAll(): Promise<IStory[]> {
    return StoryModel.find().populate("beneficiary reviewedBy");
  }

  async findById(id: string): Promise<IStory | null> {
    return StoryModel.findById(id).populate("beneficiary reviewedBy");
  }

  async updateStory(id: string, data: Partial<IStory>): Promise<IStory | null> {
    return StoryModel.findByIdAndUpdate(id, data, { new: true }).populate("beneficiary reviewedBy");
  }

  async reviewStory(id: string, reviewerId: string): Promise<IStory | null> {
    const story = await StoryModel.findById(id);
    if (!story) return null;
    story.status = "processing";
    story.reviewedBy = reviewerId;
    story.reviewedAt = new Date();
    return story.save();
  }

  async rejectStory(id: string, reason?: string): Promise<IStory | null> {
    const story = await StoryModel.findById(id);
    if (!story) return null;
    story.status = "rejected";
    story.reviewedAt = new Date();
    story.reason = reason;
    return story.save();
  }
}
