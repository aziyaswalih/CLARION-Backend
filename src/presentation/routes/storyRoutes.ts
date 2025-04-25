import express, { Request, Response } from 'express';
import { submitStory, getBeneficiaryStories, rejectStory, updateStory, getStories } from "../controllers/StoryController";
import { authMiddleware } from "../../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/", authMiddleware(['volunteer']), submitStory);
router.get("/", authMiddleware(['volunteer']), getBeneficiaryStories);
router.post("/:id/approve", authMiddleware(['volunteer']), updateStory);
router.post("/:id/reject", authMiddleware(['volunteer']),  rejectStory);
router.get('/stories',(req:Request, res:Response) => getStories(req,res))

export default router;
