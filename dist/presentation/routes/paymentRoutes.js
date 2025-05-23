"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentController_1 = require("../controllers/PaymentController");
const router = express_1.default.Router();
router.post("/create-Donation", PaymentController_1.createDonationController);
router.post("/verify-payment", PaymentController_1.verifyPaymentController);
router.post("/donation", PaymentController_1.createNewDonation); // For testing purposes, remove in production
exports.default = router;
