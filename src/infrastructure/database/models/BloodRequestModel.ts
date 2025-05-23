import mongoose, { Document, Schema } from "mongoose";

export interface IBloodRequest extends Document {
  requester: mongoose.Types.ObjectId;
  donor?: mongoose.Types.ObjectId;
  location: string;
  status: "pending" | "completed";
  requestType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema: Schema<IBloodRequest> = new Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    requestType: {
      type: String,
      enum: ["emergency", "voluntary"],
      default: "voluntary",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IBloodRequest>(
  "BloodRequest",
  BloodRequestSchema
);
