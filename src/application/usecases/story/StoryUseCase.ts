import jwt, { JwtPayload } from "jsonwebtoken";
import Story from "../../../infrastructure/database/models/StoryModel";
import { HttpStatus } from "../../../constants/httpStatus";
import { GetBeneficiaryUseCase } from "../beneficiary/BeneficiaryUseCase";
import { BeneficiaryMongoRepository } from "../../../infrastructure/repositories/beneficiary/BeneficiaryMongoRepository";
import { Request, Response } from "express";
import { io } from "../../../app";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const beneficiaryRepository = new BeneficiaryMongoRepository();
const beneficiaryUseCase = new GetBeneficiaryUseCase(beneficiaryRepository);

export class StoryUseCase {
  private async decodeToken(req: Request): Promise<string> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      throw {
        status: HttpStatus.UNAUTHORIZED,
        message: "Access token is missing",
      };

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;
    return decoded.id;
  }

  private async getBeneficiary(userId: string) {
    const beneficiary = await beneficiaryUseCase.execute(userId);
    if (!beneficiary) throw { status: 404, message: "Beneficiary not found" };
    return beneficiary;
  }

  public submit = async (req: Request, res: Response) => {
    try {
      const userId = await this.decodeToken(req);
      await this.getBeneficiary(userId);

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const images = files?.images?.map((f) => f.filename) || [];
      const documents = files?.documents?.map((f) => f.filename) || [];

      const story = new Story({
        ...req.body,
        beneficiary: userId,
        images,
        documents,
      });
      await story.save();
      io.emit("new_story_added");

      res.status(201).json(story);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };

  public getByBeneficiary = async (req: Request, res: Response) => {
    try {
      const userId = await this.decodeToken(req);
      await this.getBeneficiary(userId);

      const stories = await Story.find({ beneficiary: userId }).populate(
        "beneficiary reviewedBy"
      );
      if (!stories.length)
        return res.status(404).json({ message: "No stories available" });

      res.status(200).json(stories);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };

  public getAll = async (_req: Request, res: Response) => {
    try {
      const stories = await Story.find()
        .populate("beneficiary reviewedBy")
        .sort({ createdAt: -1 });
      if (!stories.length)
        return res.status(404).json({ message: "No stories available" });

      res.status(200).json(stories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateStatus = async (data: {
    id: string;
    status: "pending" | "processing" | "approved" | "completed" | "rejected";
  }) => {
    try {
      const { id, status } = data;

      const story = await Story.findById(id).populate("beneficiary reviewedBy");

      if (!story) {
        throw new Error("Story not found.");
      }

      story.status = status;
      await story.save();

      return story;
    } catch (error: any) {
      console.error("Error updating story status:", error.message);
      throw new Error(error.message || "Failed to update story status.");
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedStory = await Story.findByIdAndUpdate(
        id,
        {
          ...updatedData,
          beneficiary: updatedData.beneficiary._id,
          reviewedBy: updatedData.reviewedBy._id,
        },
        { new: true }
      ).populate("beneficiary reviewedBy");

      if (!updatedStory)
        return res.status(404).json({ message: "Story not found" });

      res
        .status(200)
        .json({ message: "Story updated successfully", story: updatedStory });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public reject = async (req: Request, res: Response) => {
    try {
      const story = await Story.findById(req.params.id).populate(
        "beneficiary reviewedBy"
      );
      if (!story) return res.status(404).json({ message: "Story not found" });

      story.status = "rejected";
      story.reviewedAt = new Date();
      await story.save();

      res.status(200).json({ message: "Story rejected" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public review = async (req: Request, res: Response) => {
    try {
      const userId = await this.decodeToken(req);

      const story = await Story.findById(req.params.id).populate(
        "beneficiary reviewedBy"
      );
      if (!story) return res.status(404).json({ message: "Story not found" });

      story.status = "processing";
      story.reviewedBy = userId;
      story.reviewedAt = new Date();
      await story.save();

      res.status(200).json({ message: "Story reviewed" });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };
}
