import express from "express";
import { DonorController } from "../controllers/DonorUserController";
import upload from '../../middlewares/multer';

const router = express.Router();

// Add a donor
router.post("/", DonorController.addDonor);

// Get all donors
router.get("/", DonorController.getDonors);

// Get donor by ID/profile
router.get("/profile", DonorController.getDonorById);

// Update donor profile with profilePic upload
router.put("/profile", upload.single('profilePic'), DonorController.updateDonor);

// Delete donor by ID
router.delete("/:id", DonorController.deleteDonor);

// Get all donations made by a donor
router.get("/donations", DonorController.getDonationsByDonorId);

export default router;
