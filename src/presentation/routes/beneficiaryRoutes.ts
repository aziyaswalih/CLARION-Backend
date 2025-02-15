// src/presentation/routes/beneficiaryRoutes.ts

import express, { Request, Response } from 'express';
import { BeneficiaryController } from '../../presentation/controllers/BeneficiaryController';
import {
    SubmitBeneficiaryDetailsUseCase,
    GetBeneficiaryUseCase,
    ListBeneficiariesUseCase, // Import List Use Case
    UpdateBeneficiaryUseCase, // Import Update Use Case
    DeleteBeneficiaryUseCase  // Import Delete Use Case
} from '../../application/usecases/beneficiary/BeneficiaryUseCase'; // ✅ Import from combined file
import { BeneficiaryMongoRepository } from '../../infrastructure/repositories/beneficiary/BeneficiaryMongoRepository';

const router = express.Router();

// Instantiate repository, use cases, and controller (Dependency Injection - manual here)
const beneficiaryRepository = new BeneficiaryMongoRepository(); // Or your actual repository
const submitBeneficiaryDetailsUseCase = new SubmitBeneficiaryDetailsUseCase(beneficiaryRepository);
const getBeneficiaryUseCase = new GetBeneficiaryUseCase(beneficiaryRepository);
const listBeneficiariesUseCase = new ListBeneficiariesUseCase(beneficiaryRepository); // Instantiate List Use Case
const updateBeneficiaryUseCase = new UpdateBeneficiaryUseCase(beneficiaryRepository); // Instantiate Update Use Case
const deleteBeneficiaryUseCase = new DeleteBeneficiaryUseCase(beneficiaryRepository); // Instantiate Delete Use Case


const beneficiaryController = new BeneficiaryController(
    submitBeneficiaryDetailsUseCase,
    getBeneficiaryUseCase,
    listBeneficiariesUseCase, // Inject List Use Case
    updateBeneficiaryUseCase, // Inject Update Use Case
    deleteBeneficiaryUseCase  // Inject Delete Use Case
);


// Define routes
router.post('/', (req: Request, res: Response) => beneficiaryController.submitDetails(req, res));
router.get('/:id', (req: Request, res: Response) => beneficiaryController.getBeneficiary(req, res));
router.get('/', (req: Request, res: Response) => beneficiaryController.listBeneficiaries(req, res)); // Route for listing
router.put('/:id', (req: Request, res: Response) => beneficiaryController.updateBeneficiary(req, res)); // Route for update
router.delete('/:id', (req: Request, res: Response) => beneficiaryController.deleteBeneficiary(req, res)); // Route for delete


export default router;