import { Request, Response } from "express";
import Story from "../../infrastructure/database/models/StoryModel";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from "../../constants/httpStatus";
import { GetBeneficiaryUseCase } from "../../application/usecases/beneficiary/BeneficiaryUseCase";
import { BeneficiaryMongoRepository } from "../../infrastructure/repositories/beneficiary/BeneficiaryMongoRepository";


interface CustomJwtPayload extends JwtPayload {
    id: string;
}

const beneficiaryRepository = new BeneficiaryMongoRepository()
const beneficiaryUseCase = new GetBeneficiaryUseCase(beneficiaryRepository)
export const submitStory = async (req: Request, res: Response) => {
  try {
    console.log('submit story reached');
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    
    const beneficiary = beneficiaryUseCase.execute(decoded.id)
    // await BeneficiaryModel.findOne({ user: decoded.id });
    if (!beneficiary) return res.status(404).json({ message: "Beneficiary not found" });
    console.log(beneficiary,'from story controller');
    
    const story = new Story({ ...req.body, beneficiary: decoded.id });
    await story.save();
    res.status(201).json(story);
  } catch (error : any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBeneficiaryStories = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    
    const beneficiary = beneficiaryUseCase.execute(decoded.id)
    // await BeneficiaryModel.findOne({ user: decoded.id });    
    if (!beneficiary) return res.status(404).json({ message: "Beneficiary not found" });
    
    const stories = await Story.find({ beneficiary: decoded.id }).populate("beneficiary reviewedBy");
    if(!stories) return res.status(404).json({message:'No stories available'})
    res.json(stories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveStory = async (req: Request, res: Response) => {
  // try {
  //   const story = await Story.findById(req.params.id).populate("beneficiary reviewedBy");
  //   if (!story) return res.status(404).json({ message: "Story not found" });

  //   story.status = "approved";
  //   story.reviewedAt = new Date();
  //   await story.save();
  //   res.json({ message: "Story approved" });
  // } catch (error:any) {
  //   res.status(500).json({ message: error.message });
  // }
  try {
    const { id } = req.params;
    const {updatedData} = req.body; // Data to be updated
    console.log(updatedData,req.body, 'updated data from story controller');
    
    // Find and update the story
    const updatedStory = await Story.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedStory) {
        return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story updated successfully", story: updatedStory });
} catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Internal server error" });
}
};

export const rejectStory = async (req: Request, res: Response) => {
  try {
    const story = await Story.findById(req.params.id).populate("beneficiary reviewedBy");
    if (!story) return res.status(404).json({ message: "Story not found" });

    story.status = "rejected";
    story.reviewedAt = new Date();
    await story.save();
    res.json({ message: "Story rejected" });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStories = async (req: Request, res: Response) => {
    try {
        console.log('get stories ethinindo?');
        
    //   const token = req.headers.authorization?.split(" ")[1];
    //   if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });
      
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
      
      // await BeneficiaryModel.findOne({ user: decoded.id });    
    //   if (!beneficiary) return res.status(404).json({ message: "Beneficiary not found" });
      
      const stories = await Story.find().populate("beneficiary reviewedBy");
      if(!stories) return res.status(404).json({message:'No stories available'})
      return res.status(200).json(stories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  export const reviewStory = async (req: Request, res: Response) => {
    try {
      const story = await Story.findById(req.params.id).populate("beneficiary reviewedBy");
      if (!story) return res.status(404).json({ message: "Story not found" });
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;   
      story.status = "processing";
      story.reviewedBy = decoded.id;
      story.reviewedAt = new Date();
      await story.save();
      res.json({ message: "Story reviewed" });
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }