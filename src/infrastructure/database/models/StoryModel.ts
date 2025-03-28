import mongoose, { Document } from "mongoose";

// Define an enum for request types
export enum RequestType {
  FINANCIAL = "financial",
  BLOOD = "blood",
  ORGAN = "organ",
  OTHER = "other",
}

// Extend your IStory interface with new fields
export interface IStory extends Document {
  beneficiary: mongoose.Types.ObjectId | string; // ID of the beneficiary
  requestType: RequestType;
  title: string;
  description: string;
  amount?: number; // Required if requestType is "financial"
  bloodGroup?: string; // Required if requestType is "blood" (or optionally for organ)
  organType?: string;  // Required if requestType is "organ"
  documents?: string[];
  images?: string[];
  status: "pending" | "processing" | "approved" | "rejected";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId | string; // ID of the volunteer reviewing the story
}

const StorySchema = new mongoose.Schema(
  {
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestType: { type: String, enum: Object.values(RequestType), required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number },
    bloodGroup: { type: String },
    organType: { type: String },
    documents: { type: [String], default: [] },
    images: { type: [String], default: [] },
    status: { type: String, enum: ["pending", "processing", "approved", "rejected"], default: "pending" },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Pre-save validation for request-specific fields
StorySchema.pre<IStory>("save", function (next) {
  if (this.requestType === RequestType.FINANCIAL) {
    if (this.amount === undefined || this.amount <= 0) {
      return next(new Error("Amount is required for financial requests and must be greater than 0"));
    }
  }
  if (this.requestType === RequestType.BLOOD) {
    if (!this.bloodGroup) {
      return next(new Error("Blood group is required for blood donation requests"));
    }
  }
  if (this.requestType === RequestType.ORGAN) {
    if (!this.organType) {
      return next(new Error("Organ type is required for organ donation requests"));
    }
    // Optionally, require bloodGroup for organ donation as well:
    if (!this.bloodGroup) {
      return next(new Error("Blood group is required for organ donation requests"));
    }
  }
  next();
});

export default mongoose.model<IStory>("Story", StorySchema);
