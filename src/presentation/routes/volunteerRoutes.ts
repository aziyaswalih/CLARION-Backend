import express from "express";
import { VolunteerController } from "../controllers/VolunteerUserController";
import upload from '../../middlewares/multer';

const router = express.Router();

router.post("/", VolunteerController.addVolunteer);
router.get("/", VolunteerController.getVolunteers);
router.get("/profile", VolunteerController.getVolunteerById);
router.put("/profile", upload.single('profilePic') , VolunteerController.updateVolunteer);
router.delete("/:id", VolunteerController.deleteVolunteer);


export default router;
