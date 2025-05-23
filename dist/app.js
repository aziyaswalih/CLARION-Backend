"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./presentation/routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./presentation/routes/adminRoutes"));
const volunteerRoutes_1 = __importDefault(require("./presentation/routes/volunteerRoutes"));
const beneficiaryRoutes_1 = __importDefault(require("./presentation/routes/beneficiaryRoutes"));
const connection_1 = require("./infrastructure/database/connection");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const paymentRoutes_1 = __importDefault(require("./presentation/routes/paymentRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AuthMiddleware_1 = require("./middlewares/AuthMiddleware");
const donorRoutes_1 = __importDefault(require("./presentation/routes/donorRoutes"));
const redis_1 = require("redis");
const storyRoutes_1 = __importDefault(require("./presentation/routes/storyRoutes"));
const walletRoutes_1 = __importDefault(require("./presentation/routes/walletRoutes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const concernRoutes_1 = __importDefault(require("./presentation/routes/concernRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
exports.redisClient.connect();
exports.redisClient.on("ready", () => console.log("Redis Connected!"));
exports.redisClient.on("error", (err) => console.log("Redis Error", err));
dotenv_1.default.config(); // Load environment variables
const corsOptions = {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};
exports.io = new socket_io_1.Server(server, {
    cors: corsOptions,
});
(0, socket_1.socket_Connection)();
exports.io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
});
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use("/uploads", express_1.default.static("uploads"));
app.use((0, cookie_parser_1.default)());
// Database Connection
(0, connection_1.connectDB)();
// Routes
app.use("/api/user", userRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/story", storyRoutes_1.default);
app.use("/api/beneficiary", (0, AuthMiddleware_1.authMiddleware)(["user", "volunteer", "donor"]), beneficiaryRoutes_1.default);
app.use("/api/volunteers", (0, AuthMiddleware_1.authMiddleware)(["volunteer"]), volunteerRoutes_1.default);
app.use("/api/donor", (0, AuthMiddleware_1.authMiddleware)(["donor"]), donorRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/wallet", (0, AuthMiddleware_1.authMiddleware)(["donor", "user", "volunteer"]), walletRoutes_1.default);
app.use("/api/concerns", (0, AuthMiddleware_1.authMiddleware)(["user", "volunteer", "donor"]), concernRoutes_1.default);
// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({ error: true, message: err.message || "Internal Server Error" });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: true, message: "Resource not found" });
});
exports.default = server;
