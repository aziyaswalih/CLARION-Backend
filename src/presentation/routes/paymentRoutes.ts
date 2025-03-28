// import express, { Request, Response } from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// // 🏆 Create an Order
// router.post("/create-order", async (req: Request, res: Response) => {
//   try {
//     const { amount, currency } = req.body;

//     const options = {
//       amount: amount * 100, // Razorpay works in paise (multiply by 100)
//       currency,
//       receipt: crypto.randomBytes(10).toString("hex"),
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error creating order" });
//   }
// });

// // 🏆 Verify Payment Signature
// router.post("/verify-payment", async (req: Request, res: Response) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generated_signature === razorpay_signature) {
//       res.status(200).json({ success: true, message: "Payment verified" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Verification failed" });
//   }
// });

// export default router;

import express from "express";
import { createDonationController, verifyPaymentController } from "../controllers/PaymentController";

const router = express.Router();

router.post("/create-Donation", createDonationController);
router.post("/verify-payment", verifyPaymentController);

export default router;
