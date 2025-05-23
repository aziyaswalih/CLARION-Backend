import express, { Request, Response } from "express";
import { BeneficiaryUserController } from "../../presentation/controllers/BeneficiaryUserController";
import {
  SubmitBeneficiaryDetailsUseCase,
  GetBeneficiaryUseCase,
  ListBeneficiariesUseCase,
  UpdateBeneficiaryUseCase,
  DeleteBeneficiaryUseCase,
} from "../../application/usecases/beneficiary/BeneficiaryUseCase"; // ✅ Import from combined file
import { BeneficiaryMongoRepository } from "../../infrastructure/repositories/beneficiary/BeneficiaryMongoRepository";
import upload from "../../middlewares/multer";
import {
  updateStory,
  getBeneficiaryStories,
  getStories,
  reviewStory,
  submitStory,
} from "../controllers/StoryController";
import { UserChatcontroller } from "../controllers/ChatController";
import { getMessagesByBeneficiaryId } from "../../application/usecases/chat/getChatByBeneficiaryId";
import { Message_mongoRepositories } from "../../infrastructure/repositories/chat/MongoChatRepository";

const router = express.Router();

// Instantiate repository, use cases, and controller (Dependency Injection - manual here)
const beneficiaryRepository = new BeneficiaryMongoRepository(); // Or your actual repository
const submitBeneficiaryDetailsUseCase = new SubmitBeneficiaryDetailsUseCase(
  beneficiaryRepository
);
const getBeneficiaryUseCase = new GetBeneficiaryUseCase(beneficiaryRepository);
const listBeneficiariesUseCase = new ListBeneficiariesUseCase(
  beneficiaryRepository
); // Instantiate List Use Case
const updateBeneficiaryUseCase = new UpdateBeneficiaryUseCase(
  beneficiaryRepository
); // Instantiate Update Use Case
const deleteBeneficiaryUseCase = new DeleteBeneficiaryUseCase(
  beneficiaryRepository
); // Instantiate Delete Use Case
const messageRespositories = new Message_mongoRepositories();
const getChatByBeneficiaryId = new getMessagesByBeneficiaryId(
  messageRespositories
);
const chatController = new UserChatcontroller(getChatByBeneficiaryId);

const beneficiaryController = new BeneficiaryUserController(
  submitBeneficiaryDetailsUseCase,
  getBeneficiaryUseCase,
  listBeneficiariesUseCase, // Inject List Use Case
  updateBeneficiaryUseCase, // Inject Update Use Case
  deleteBeneficiaryUseCase // Inject Delete Use Case
);

// Define routes
router.post("/", (req: Request, res: Response) =>
  beneficiaryController.submitDetails(req, res)
);
router.get("/profile", (req: Request, res: Response) =>
  beneficiaryController.getBeneficiary(req, res)
);
router.put(
  "/profile",
  upload.single("profilePic"),
  (req: Request, res: Response) =>
    beneficiaryController.updateBeneficiary(req, res)
); // Route for update
router.get("/stories", (req: Request, res: Response) => getStories(req, res));
router.post(
  "/story",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  (req: Request, res: Response) => submitStory(req, res)
);
router.put(
  "/story/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  (req: Request, res: Response) => updateStory(req, res)
);
router.put("/story/:id/review", (req: Request, res: Response) =>
  reviewStory(req, res)
);

router.get("/chats-userId/:id", (req, res, next) => {
  chatController.user_getChats(req, res, next);
});
router.get("/volunteers/:id", (req, res, next) => {
  beneficiaryController.User_get_volunteerdetailsControl(req, res, next);
});

export default router;
