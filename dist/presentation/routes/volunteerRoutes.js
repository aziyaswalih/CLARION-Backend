"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VolunteerUserController_1 = require("../controllers/VolunteerUserController");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
router.post("/", VolunteerUserController_1.VolunteerController.addVolunteer);
router.get("/", VolunteerUserController_1.VolunteerController.getVolunteers);
router.get("/profile", VolunteerUserController_1.VolunteerController.getVolunteerById);
router.put("/profile", multer_1.default.single("profilePic"), VolunteerUserController_1.VolunteerController.updateVolunteer);
router.delete("/:id", VolunteerUserController_1.VolunteerController.deleteVolunteer);
exports.default = router;
