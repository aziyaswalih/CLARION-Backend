"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewDonation = exports.verifyPaymentController = exports.createDonationController = void 0;
const paymentService_1 = require("../../infrastructure/services/paymentService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatus_1 = require("../../constants/httpStatus");
const StoryMongoRepository_1 = require("../../infrastructure/repositories/story/StoryMongoRepository");
const WalletController_1 = require("./WalletController");
const WalletService_1 = require("../../infrastructure/services/WalletService");
const TransactionModel_1 = require("../../infrastructure/database/models/TransactionModel");
const storyRepository = new StoryMongoRepository_1.StoryMongoRepository();
const createDonationController = async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const order = await (0, paymentService_1.createDonation)(amount, currency);
        res.status(httpStatus_1.HttpStatus.OK).json({ success: true, createDonation: order });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "Error creating order" });
    }
};
exports.createDonationController = createDonationController;
const verifyPaymentController = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if ((0, paymentService_1.verifyPayment)(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Payment verified" });
        }
        else {
            res
                .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                .json({ success: false, message: "Invalid signature" });
        }
    }
    catch (error) {
        console.error("Verification failed:", error);
        res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "Verification failed" });
    }
};
exports.verifyPaymentController = verifyPaymentController;
const createNewDonation = async (req, res) => {
    try {
        const { causeId, amount } = req.body;
        let donorId = "Anonymous"; // default
        // If not anonymous, extract donor ID from token
        if (req.headers?.authorization?.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                donorId = decodedToken.id;
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, message: "Invalid token" });
            }
        }
        if (donorId !== "Anonymous") {
            const wallet = await (0, WalletService_1.getWalletByUserId)(donorId);
            if (wallet?.balance < amount) {
                await (0, WalletService_1.deductFromWallet)(donorId, wallet?.balance, "donating");
                await TransactionModel_1.Transaction.create({
                    userId: donorId,
                    amount: amount - wallet?.balance,
                    mode: "razorpay",
                    walletUsed: amount,
                    purpose: "donating",
                    status: "success",
                });
            }
            else if (wallet?.balance >= amount) {
                await (0, WalletService_1.deductFromWallet)(donorId, amount, "donating");
            }
            else {
                await TransactionModel_1.Transaction.create({
                    userId: donorId,
                    amount: amount,
                    mode: "razorpay",
                    walletUsed: amount,
                    purpose: "donating",
                    status: "success",
                });
            }
        }
        // 1. Save donation
        await (0, paymentService_1.newDonation)({ storyId: causeId, amount, donorId });
        // 2. Update story amount
        const story = await storyRepository.findById(causeId);
        if (!story) {
            return res
                .status(httpStatus_1.HttpStatus.NOT_FOUND)
                .json({ success: false, message: "Story not found" });
        }
        const raisedAmount = story.raisedAmount || 0;
        const update = await storyRepository.updateStory(causeId, {
            raisedAmount: raisedAmount + Number(amount),
        });
        if (update?.raisedAmount &&
            update?.amount &&
            update.raisedAmount >= update.amount) {
            await storyRepository.updateStory(causeId, { status: "completed" });
            const refund = update?.raisedAmount - update?.amount;
            if (refund > 0) {
                await storyRepository.updateStory(causeId, {
                    raisedAmount: update.amount,
                });
                if (donorId !== "Anonymous") {
                    await (0, WalletController_1.addWalletBalance)(donorId, refund, "refund");
                }
            }
        }
        return res
            .status(httpStatus_1.HttpStatus.CREATED)
            .json({ success: true, message: "Donation created successfully" });
    }
    catch (error) {
        console.error("Error creating donation:", error);
        return res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "Error creating donation" });
    }
};
exports.createNewDonation = createNewDonation;
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
