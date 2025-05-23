"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StoryController_1 = require("../controllers/StoryController");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const router = express_1.default.Router();
router.post("/", (0, AuthMiddleware_1.authMiddleware)(["volunteer"]), StoryController_1.submitStory);
router.get("/", (0, AuthMiddleware_1.authMiddleware)(["volunteer"]), StoryController_1.getBeneficiaryStories);
router.post("/:id/approve", (0, AuthMiddleware_1.authMiddleware)(["volunteer"]), StoryController_1.updateStory);
router.post("/:id/reject", (0, AuthMiddleware_1.authMiddleware)(["volunteer"]), StoryController_1.rejectStory);
router.get("/stories", (req, res) => (0, StoryController_1.getStories)(req, res));
exports.default = router;
