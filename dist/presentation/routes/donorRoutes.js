"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DonorUserController_1 = require("../controllers/DonorUserController");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
// Add a donor
router.post("/", DonorUserController_1.DonorController.addDonor);
// Get all donors
router.get("/", DonorUserController_1.DonorController.getDonors);
// Get donor by ID/profile
router.get("/profile", DonorUserController_1.DonorController.getDonorById);
// Update donor profile with profilePic upload
router.put("/profile", multer_1.default.single("profilePic"), DonorUserController_1.DonorController.updateDonor);
// Delete donor by ID
router.delete("/:id", DonorUserController_1.DonorController.deleteDonor);
// Get all donations made by a donor
router.get("/donations", DonorUserController_1.DonorController.getDonationsByDonorId);
router.post("/blood", DonorUserController_1.DonorController.addBloodDonation);
exports.default = router;
