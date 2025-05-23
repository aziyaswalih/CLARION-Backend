"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BeneficiaryUserController_1 = require("../../presentation/controllers/BeneficiaryUserController");
const BeneficiaryUseCase_1 = require("../../application/usecases/beneficiary/BeneficiaryUseCase"); // ✅ Import from combined file
const BeneficiaryMongoRepository_1 = require("../../infrastructure/repositories/beneficiary/BeneficiaryMongoRepository");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const StoryController_1 = require("../controllers/StoryController");
const ChatController_1 = require("../controllers/ChatController");
const getChatByBeneficiaryId_1 = require("../../application/usecases/chat/getChatByBeneficiaryId");
const MongoChatRepository_1 = require("../../infrastructure/repositories/chat/MongoChatRepository");
const router = express_1.default.Router();
// Instantiate repository, use cases, and controller (Dependency Injection - manual here)
const beneficiaryRepository = new BeneficiaryMongoRepository_1.BeneficiaryMongoRepository(); // Or your actual repository
const submitBeneficiaryDetailsUseCase = new BeneficiaryUseCase_1.SubmitBeneficiaryDetailsUseCase(beneficiaryRepository);
const getBeneficiaryUseCase = new BeneficiaryUseCase_1.GetBeneficiaryUseCase(beneficiaryRepository);
const listBeneficiariesUseCase = new BeneficiaryUseCase_1.ListBeneficiariesUseCase(beneficiaryRepository); // Instantiate List Use Case
const updateBeneficiaryUseCase = new BeneficiaryUseCase_1.UpdateBeneficiaryUseCase(beneficiaryRepository); // Instantiate Update Use Case
const deleteBeneficiaryUseCase = new BeneficiaryUseCase_1.DeleteBeneficiaryUseCase(beneficiaryRepository); // Instantiate Delete Use Case
const messageRespositories = new MongoChatRepository_1.Message_mongoRepositories();
const getChatByBeneficiaryId = new getChatByBeneficiaryId_1.getMessagesByBeneficiaryId(messageRespositories);
const chatController = new ChatController_1.UserChatcontroller(getChatByBeneficiaryId);
const beneficiaryController = new BeneficiaryUserController_1.BeneficiaryUserController(submitBeneficiaryDetailsUseCase, getBeneficiaryUseCase, listBeneficiariesUseCase, // Inject List Use Case
updateBeneficiaryUseCase, // Inject Update Use Case
deleteBeneficiaryUseCase // Inject Delete Use Case
);
// Define routes
router.post("/", (req, res) => beneficiaryController.submitDetails(req, res));
router.get("/profile", (req, res) => beneficiaryController.getBeneficiary(req, res));
router.put("/profile", multer_1.default.single("profilePic"), (req, res) => beneficiaryController.updateBeneficiary(req, res)); // Route for update
router.get("/stories", (req, res) => (0, StoryController_1.getStories)(req, res));
router.post("/story", multer_1.default.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
]), (req, res) => (0, StoryController_1.submitStory)(req, res));
router.put("/story/:id", multer_1.default.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
]), (req, res) => (0, StoryController_1.updateStory)(req, res));
router.put("/story/:id/review", (req, res) => (0, StoryController_1.reviewStory)(req, res));
router.get("/chats-userId/:id", (req, res, next) => {
    chatController.user_getChats(req, res, next);
});
router.get("/volunteers/:id", (req, res, next) => {
    beneficiaryController.User_get_volunteerdetailsControl(req, res, next);
});
exports.default = router;
