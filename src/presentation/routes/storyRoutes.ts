import express from "express";
import { submitStory, getBeneficiaryStories, approveStory, rejectStory } from "../controllers/StoryController";
import { authMiddleware } from "../../middlewares/AuthMiddleware";

const router = express.Router();

router.post("/", authMiddleware(['volunteer']), submitStory);
router.get("/", authMiddleware(['volunteer']), getBeneficiaryStories);
router.post("/:id/approve", authMiddleware(['volunteer']), approveStory);
router.post("/:id/reject", authMiddleware(['volunteer']),  rejectStory);

export default router;
