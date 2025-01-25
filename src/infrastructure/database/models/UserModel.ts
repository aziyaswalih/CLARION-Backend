import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  isActive: boolean;
  profilePic: string;
  role: "admin" | "user" | "donor" | "volunteer";
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profilePic: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["admin", "user", "donor", "volunteer"], default: "user" },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
