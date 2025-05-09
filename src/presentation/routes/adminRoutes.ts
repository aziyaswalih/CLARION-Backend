import express from "express";
import { AdminController } from "../controllers/Admin/AdminController";
import { LoginAdminUseCase } from "../../application/usecases/admin/LoginAdminUseCase";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { BeneficiaryController } from "../controllers/Admin/BeneficiaryController";
import { VolunteerController } from "../controllers/Admin/VolunteerController";
import { DonorController } from "../controllers/Admin/DonorController";
import { authMiddleware } from "../../middlewares/AdminAuthMiddleware";
// import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
const router = express.Router();
const userRepository = new UserMongoRepository();
const loginUseCase = new LoginAdminUseCase(userRepository);
const beneficiaryController = new BeneficiaryController()
const volunteerController = new VolunteerController()
const donorController = new DonorController()
const adminController = new AdminController(loginUseCase)


router.post("/login", (req, res) => adminController.login(req,res));

router.get("/beneficiaries",authMiddleware,  beneficiaryController.getAllBeneficiaries);
router.put("/beneficiaries/block/:id",authMiddleware, beneficiaryController.blockBeneficiary);
router.put("/beneficiaries/unblock/:id",authMiddleware, beneficiaryController.unblockBeneficiary);
router.get("/beneficiary/edit/:id",authMiddleware, beneficiaryController.getBeneficiary);
router.put("/beneficiary/update/:id",authMiddleware, beneficiaryController.editBeneficiary);
// router.post("/beneficiary/create", beneficiaryController.addBeneficiary);


router.get("/volunteers",authMiddleware, (req, res) => volunteerController.getAllVolunteers(req,res));
router.put("/volunteers/block/:id",authMiddleware, volunteerController.blockVolunteer);
router.put("/volunteers/unblock/:id",authMiddleware, volunteerController.unblockVolunteer);
router.get("/volunteers/edit/:id",authMiddleware, volunteerController.getVolunteer);
router.put("/volunteers/update/:id",authMiddleware, volunteerController.editVolunteer);


router.get("/donors",authMiddleware, (req, res) => donorController.getAllDonors(req, res));
router.put("/donors/block/:id",authMiddleware, donorController.blockDonor);
router.put("/donors/unblock/:id",authMiddleware, donorController.unblockDonor);
router.get("/donors/edit/:id",authMiddleware, donorController.getDonor);
router.put("/donors/update/:id",authMiddleware, donorController.editDonor);

router.get("/reports",authMiddleware, (req, res) => adminController.getDonationReport(req,res));

export default router;
