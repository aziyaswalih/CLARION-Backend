import dotenv from "dotenv";

dotenv.config();

export const environment = {
  dbUri: process.env.DB_URI || "mongodb://127.0.0.1:27017/CLARION",
  jwtSecret: process.env.JWT_SECRET || "aziya",
  port: process.env.PORT || 5000,
};
