import express from "express";
import { AdminController } from "../controllers/AdminController";
import { LoginAdminUseCase } from "../../application/usecases/admin/LoginAdminUseCase";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { BeneficiaryController } from "../controllers/BeneficiaryController";
import { VolunteerController } from "../controllers/VolunteerController";
import { DonorController } from "../controllers/DonorController";
// import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
const router = express.Router();
const userRepository = new UserMongoRepository();
const loginUseCase = new LoginAdminUseCase(userRepository);
const beneficiaryController = new BeneficiaryController()
const volunteerController = new VolunteerController()
const donorController = new DonorController()
const adminController = new AdminController(
    loginUseCase
)


router.post("/login", (req, res) => adminController.login(req,res));

router.get("/beneficiaries", (req, res) => beneficiaryController.getAllBeneficiaries(req,res));
router.put("/beneficiaries/block/:id", beneficiaryController.blockBeneficiary);
router.put("/beneficiaries/unblock/:id", beneficiaryController.unblockBeneficiary);
router.get("/beneficiary/edit/:id", beneficiaryController.getBeneficiary);
router.put("/beneficiary/update/:id", beneficiaryController.editBeneficiary);
// router.post("/beneficiary/create", beneficiaryController.addBeneficiary);


router.get("/volunteers", (req, res) => volunteerController.getAllVolunteers(req,res));
router.put("/volunteers/block/:id", volunteerController.blockVolunteer);
router.put("/volunteers/unblock/:id", volunteerController.unblockVolunteer);
router.get("/volunteers/edit/:id", volunteerController.getVolunteer);
router.put("/volunteers/update/:id", volunteerController.editVolunteer);


router.get("/donors", (req, res) => donorController.getAllDonors(req, res));
router.put("/donors/block/:id", donorController.blockDonor);
router.put("/donors/unblock/:id", donorController.unblockDonor);
router.get("/donors/edit/:id", donorController.getDonor);
router.put("/donors/update/:id", donorController.editDonor);


export default router;
