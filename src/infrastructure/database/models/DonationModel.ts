import { Schema, model, Document } from "mongoose";
import StoryModel from "./StoryModel";

export interface Donation {
  donorId: string;
  storyId: string;
  amount: number;
  date: Date;
}

export interface DonationDocument extends Document {
  donorId: string;
  storyId: string;
  amount: number;
  date: Date;
}

const DonationSchema = new Schema<DonationDocument>({
  donorId: { type: String, default: "Anonymous" },
  storyId: { type: String, ref: StoryModel, required: true },
  amount: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now },
});

const DonationModel = model<DonationDocument>("Donation", DonationSchema);

export default DonationModel;
