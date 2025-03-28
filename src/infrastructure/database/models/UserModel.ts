import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  isActive: boolean;
  profilePic: string;
  role: "admin" | "user" | "donor" | "volunteer";
  is_verified: boolean;
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
    is_verified: {type: Boolean,default: false}
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
