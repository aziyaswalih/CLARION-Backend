import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/charity";
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process on connection failure
  }
};
