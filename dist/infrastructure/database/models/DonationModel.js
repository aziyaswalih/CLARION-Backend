"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StoryModel_1 = __importDefault(require("./StoryModel"));
const DonationSchema = new mongoose_1.Schema({
    donorId: { type: String, default: "Anonymous" },
    storyId: { type: String, ref: StoryModel_1.default, required: true },
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
});
const DonationModel = (0, mongoose_1.model)("Donation", DonationSchema);
exports.default = DonationModel;
