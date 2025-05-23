import { razorpay } from "../../config/razorpay";
import { generateReceipt } from "../../utils/generateReceipt";
import crypto from "crypto";
import DonationModel from "../database/models/DonationModel";

export const createDonation = async (amount: number, currency: string) => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: generateReceipt(),
  };

  return await razorpay.orders.create(options);
};

export const verifyPayment = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return generatedSignature === signature;
};

export const newDonation = async ({
  storyId,
  amount,
  donorId,
}: {
  storyId: string;
  amount: number;
  donorId: string;
}) => {
  const donation = new DonationModel({
    donorId,
    storyId,
    amount,
    date: new Date(),
  });

  await donation.save();

  return donation;
};
