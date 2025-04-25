import { Request, Response } from "express";
import { newDonation, createDonation, verifyPayment } from "../../infrastructure/services/paymentService";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../../constants/httpStatus";
import { StoryMongoRepository } from "../../infrastructure/repositories/story/StoryMongoRepository";
import { addWalletBalance } from "./WalletController";
import { deductFromWallet, getWalletByUserId } from "../../infrastructure/services/WalletService";
import { Transaction } from "../../infrastructure/database/models/TransactionModel";

const storyRepository = new StoryMongoRepository();
export const createDonationController = async (req: Request, res: Response) => {
  try {
    const {  amount, currency } = req.body;
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

export const createNewDonation = async (req: Request, res: Response) => {
  try {
    const { causeId, amount } = req.body;
    let donorId = "Anonymous"; // default

    // If not anonymous, extract donor ID from token
    if (req.headers?.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
      
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        donorId = decodedToken.id;
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid token" });
      }
    }
    if(donorId !== "Anonymous"){
    const wallet = await getWalletByUserId(donorId);
    if(wallet?.balance < amount){
      await deductFromWallet(donorId, wallet?.balance, "donating");
      await Transaction.create({
          userId: donorId,
          amount:amount - wallet?.balance,
          mode: 'razorpay',
          walletUsed: amount,
          purpose: "donating",
          status: 'success',
        });
       
    }else if(wallet?.balance >= amount){
      await deductFromWallet(donorId, amount, "donating");
    }else{
      await Transaction.create({
        userId: donorId,
        amount:amount,
        mode: 'razorpay',
        walletUsed: amount,
        purpose: "donating",
        status: 'success',
      });
    }
  }
    // 1. Save donation
    await newDonation({ storyId: causeId, amount, donorId });

    // 2. Update story amount
    const story = await storyRepository.findById(causeId);
    if (!story) {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Story not found" });
    }

    const raisedAmount = story.raisedAmount || 0;
    const update = await storyRepository.updateStory(causeId, { raisedAmount: raisedAmount + Number(amount) });
    if(update?.raisedAmount && update?.amount && update.raisedAmount >= update.amount){
      await storyRepository.updateStory(causeId, { status: "completed" })
      const refund = update?.raisedAmount - update?.amount;
      if(refund > 0){ 
        await storyRepository.updateStory(causeId, { raisedAmount: update.amount });
        if(donorId !== "Anonymous"){
          await addWalletBalance( donorId, refund,"refund" );
        }
      }
    }
    return res.status(HttpStatus.CREATED).json({ success: true, message: "Donation created successfully" });

  } catch (error) {
    console.error("Error creating donation:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error creating donation" });
  }
};

// export const createNewDonation = async (req: Request, res: Response) => {
//   try {
//     const { causeId, amount } = req.body;
//     if(req.headers?.authorization && req.headers?.authorization.startsWith("Bearer")){
//       const token = req.headers.authorization.split(" ")[1];
//       console.log(token,'token');
//       const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
//       if (typeof decodedToken === "object" && "id" in decodedToken) {
//         const create = await newDonation({ storyId: causeId, amount, donorId: decodedToken.id });
//         const story = await storyRepository.findById(causeId);
//         if (!story) {
//           return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Story not found" });
//         }
//         const raisedAmount = story.raisedAmount || 0;
//         const updatedStory = await storyRepository.updateStory(causeId, { raisedAmount: Number(amount)+raisedAmount });
//         res.status(HttpStatus.CREATED).json({ success: true, message: "Donation created successfully" });
//         return;
//       } else {
//         throw new Error("Invalid token payload");
//       }
//     }
//     res.status(HttpStatus.CREATED).json({ success: true, message: "Donation created successfully" });
//     return;
//   } catch (error) {
//     console.error("Error creating donation:", error);
//     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error creating donation" });
//   }
// }