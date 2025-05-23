import express from "express";
import {
  createNewDonation,
  createDonationController,
  verifyPaymentController,
} from "../controllers/PaymentController";

const router = express.Router();

router.post("/create-Donation", createDonationController);
router.post("/verify-payment", verifyPaymentController);
router.post("/donation", createNewDonation); // For testing purposes, remove in production

export default router;
