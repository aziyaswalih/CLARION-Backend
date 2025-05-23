import { IStory } from "../../infrastructure/database/models/StoryModel";

export interface IStoryRepository {
  createStory(data: Partial<IStory>): Promise<IStory>;
  findByBeneficiary(id: string): Promise<IStory[]>;
  findAll(): Promise<IStory[]>;
  findById(id: string): Promise<IStory | null>;
  updateStory(id: string, data: Partial<IStory>): Promise<IStory | null>;
  reviewStory(id: string, reviewerId: string): Promise<IStory | null>;
  rejectStory(id: string, reason?: string): Promise<IStory | null>;
}
