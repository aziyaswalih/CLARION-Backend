import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./presentation/routes/userRoutes";
import adminRoutes from "./presentation/routes/adminRoutes";
import volunteerRoutes from "./presentation/routes/volunteerRoutes";
import beneficiaryRoutes from "./presentation/routes/beneficiaryRoutes";
import { connectDB } from "./infrastructure/database/connection";
import dotenv from "dotenv";
import morgan from "morgan"
import paymentRoutes from "./presentation/routes/paymentRoutes";
import cookieParser from 'cookie-parser';
import { authMiddleware } from "./middlewares/AuthMiddleware";
import donorRoutes from "./presentation/routes/donorRoutes";
import { createClient } from 'redis';
import storyRoutes from "./presentation/routes/storyRoutes";
import walletRoutes from "./presentation/routes/walletRoutes";

export const redisClient = createClient({
  url: 'redis://localhost:6379',
});
redisClient.connect();
redisClient.on('ready', () => console.log('Redis Connected!'));
redisClient.on('error', (err) => console.log('Redis Error', err));


dotenv.config(); // Load environment variables

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // explicitly allow your frontend URL
    credentials: true, // allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use('/uploads', express.static('uploads'));
app.use(cookieParser())
// Database Connection
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/beneficiary",authMiddleware(['user','volunteer','donor']), beneficiaryRoutes);
app.use("/api/volunteers",authMiddleware(['volunteer']), volunteerRoutes);
app.use("/api/donor",authMiddleware(['donor']), donorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet", authMiddleware(['donor','user','volunteer']), walletRoutes);
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


