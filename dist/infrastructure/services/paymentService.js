"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDonation = exports.verifyPayment = exports.createDonation = void 0;
const razorpay_1 = require("../../config/razorpay");
const generateReceipt_1 = require("../../utils/generateReceipt");
const crypto_1 = __importDefault(require("crypto"));
const DonationModel_1 = __importDefault(require("../database/models/DonationModel"));
const createDonation = async (amount, currency) => {
    const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: (0, generateReceipt_1.generateReceipt)(),
    };
    return await razorpay_1.razorpay.orders.create(options);
};
exports.createDonation = createDonation;
const verifyPayment = (orderId, paymentId, signature) => {
    const generatedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");
    return generatedSignature === signature;
};
exports.verifyPayment = verifyPayment;
const newDonation = async ({ storyId, amount, donorId, }) => {
    const donation = new DonationModel_1.default({
        donorId,
        storyId,
        amount,
        date: new Date(),
    });
    await donation.save();
    return donation;
};
exports.newDonation = newDonation;
