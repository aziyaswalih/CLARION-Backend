import { Request, Response } from "express";
import { StoryUseCase } from "../../application/usecases/story/StoryUseCase";

const storyUseCase = new StoryUseCase();

export const submitStory = storyUseCase.submit;
export const getBeneficiaryStories = storyUseCase.getByBeneficiary;
export const getStories = storyUseCase.getAll;
export const updateStory = storyUseCase.update;
export const rejectStory = storyUseCase.reject;
export const reviewStory = storyUseCase.review;
