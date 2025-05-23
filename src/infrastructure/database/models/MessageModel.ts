import mongoose, { Document, Schema } from "mongoose";
// import { Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  receiver: string;
  userType: "user" | "volunteer";
  message: string;
  messageId?: string;
  timestamp: Date;
  isRead: boolean;
  attachment?: {
    type: string;
    url: string;
    name: string;
    size: number;
  };
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    required: true,
  },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  messageId: { type: String, required: false },
  userType: { type: String, enum: ["user", "volunteer"], required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  attachment: {
    type: {
      type: String, // Example: 'image', 'audio', 'pdf'
      required: false,
    },
    url: {
      type: String, // File URL from storage (Firebase, S3, local storage, etc.)
      required: false,
    },
    name: {
      type: String, // File name
      required: false,
    },
    size: {
      type: Number, // File size in bytes
      required: false,
    },
  },
});

export const MessageModel = mongoose.model("Message", MessageSchema);
