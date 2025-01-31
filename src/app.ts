import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./presentation/routes/userRoutes";
import adminRoutes from "./presentation/routes/adminRoutes";
import { connectDB } from "./infrastructure/database/connection";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: true, message: err.message || "Internal Server Error" });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: true, message: "Resource not found" });
});

export default app;
