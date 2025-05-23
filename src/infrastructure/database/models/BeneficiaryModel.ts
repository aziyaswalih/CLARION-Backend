import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { UserModel, IUser } from "./UserModel";

// Define an interface for Beneficiary Document
export interface IBeneficiary extends Document {
  user: ObjectId;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  identificationType: string;
  identificationNumber: string;
  familyDetails: {
    membersCount: number;
    incomeLevel: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const BeneficiarySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    identificationType: { type: String, required: true, trim: true }, // Changed from nested identification.type
    identificationNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    }, // Changed from nested identification.number
    familyDetails: {
      membersCount: { type: Number, required: true },
      incomeLevel: { type: String, required: true, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const BeneficiaryModel = mongoose.model<IBeneficiary>(
  "Beneficiary",
  BeneficiarySchema
);
