import { Request, Response } from "express";
import { createDonation, verifyPayment } from "../../infrastructure/services/paymentService";
import { HttpStatus } from "../../constants/httpStatus";

export const createDonationController = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const order = await createDonation(amount, currency);
    res.status(HttpStatus.OK).json({ success: true, createDonation:order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error creating order" });
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      res.status(HttpStatus.OK).json({ success: true, message: "Payment verified" });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Verification failed" });
  }
};
