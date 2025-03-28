// src/presentation/controllers/BeneficiaryController.ts

import { Request, Response } from 'express';
import {
    SubmitBeneficiaryDetailsUseCase,
    GetBeneficiaryUseCase,
    ListBeneficiariesUseCase,
    UpdateBeneficiaryUseCase,
    DeleteBeneficiaryUseCase
} from '../../application/usecases/beneficiary/BeneficiaryUseCase'; // Adjust import path if necessary
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserUseCases } from '../../application/usecases/user/userUseCase';
import { UserMongoRepository } from '../../infrastructure/repositories/user/UserMongoRepository';
import { HttpStatus } from '../../constants/httpStatus';
interface CustomJwtPayload extends JwtPayload {
    id: string; // Add the expected properties
  }
    const userRepo = new UserMongoRepository();
    const userUseCases = new UserUseCases(userRepo);
  
export class BeneficiaryUserController {
    private submitBeneficiaryDetailsUseCase: SubmitBeneficiaryDetailsUseCase;
    private getBeneficiaryUseCase: GetBeneficiaryUseCase;
    private listBeneficiariesUseCase: ListBeneficiariesUseCase;
    private updateBeneficiaryUseCase: UpdateBeneficiaryUseCase;
    private deleteBeneficiaryUseCase: DeleteBeneficiaryUseCase;

    constructor(
        submitBeneficiaryDetailsUseCase: SubmitBeneficiaryDetailsUseCase,
        getBeneficiaryUseCase: GetBeneficiaryUseCase,
        listBeneficiariesUseCase: ListBeneficiariesUseCase,
        updateBeneficiaryUseCase: UpdateBeneficiaryUseCase,
        deleteBeneficiaryUseCase: DeleteBeneficiaryUseCase
    ) {
        this.submitBeneficiaryDetailsUseCase = submitBeneficiaryDetailsUseCase;
        this.getBeneficiaryUseCase = getBeneficiaryUseCase;
        this.listBeneficiariesUseCase = listBeneficiariesUseCase;
        this.updateBeneficiaryUseCase = updateBeneficiaryUseCase;
        this.deleteBeneficiaryUseCase = deleteBeneficiaryUseCase;
    }

    async submitDetails(req: Request, res: Response): Promise<void> {
        try {
            const beneficiaryDetails = req.body; // Assuming request body contains beneficiary details
            const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>" format

        if (!token) {
             res.status(HttpStatus.UNAUTHORIZED).json({ message: "Authentication token required" });
             return;
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        console.log(decodedToken);
        const user = decodedToken.id
        
            const newBeneficiary = await this.submitBeneficiaryDetailsUseCase.execute({...beneficiaryDetails,user:Object(user)});
            res.status(201).json(newBeneficiary); // 201 Created for successful resource creation
        } catch (error: any) {
            console.error("Error submitting beneficiary details:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to submit beneficiary details', error: error.message });
        }
    }

    async getBeneficiary(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(" ")[1];
                    if(!token) { res.status(HttpStatus.UNAUTHORIZED).json({message:"Access token is missing" })
                        return
                    }
        
                    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

            const id = decoded.id;
            const beneficiary = await this.getBeneficiaryUseCase.execute(id);
            if (beneficiary) {
                res.status(HttpStatus.OK).json(beneficiary);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Beneficiary not found' });
            }
        } catch (error: any) {
            console.error("Error getting beneficiary:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get beneficiary', error: error.message });
        }
    }

    async listBeneficiaries(req: Request, res: Response): Promise<void> {
        try {
            const beneficiaries = await this.listBeneficiariesUseCase.execute();
            res.status(HttpStatus.OK).json(beneficiaries);
        } catch (error: any) {
            console.error("Error listing beneficiaries:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to list beneficiaries', error: error.message });
        }
    }

    async updateBeneficiary(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if(!token) { res.status(HttpStatus.UNAUTHORIZED).json({message:"Access token is missing" })
                return
            }
            console.log(('update beneficiary ethi'));
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
            let profilePicUrl;
            if (req.file) {
                profilePicUrl = `/uploads/${req.file.filename}`;
            }
    
            // Merge the file path with other body fields
            const updatedData = {
                ...req.body,
                ...(profilePicUrl && { profilePic: profilePicUrl })
            };
            const id = decoded.id;            
            const updates = req.body; // Assuming request body contains updates
            const updatedUser = await userUseCases.updateUser(decoded.id, updatedData);

            const updatedBeneficiary = await this.updateBeneficiaryUseCase.execute(id, updates);

            if (updatedBeneficiary) {
                res.status(HttpStatus.OK).json(updatedBeneficiary);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Beneficiary not found for update' });
            }
        } catch (error: any) {
            console.error("Error updating beneficiary:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update beneficiary', error: error.message });
        }
    }

    async deleteBeneficiary(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            await this.deleteBeneficiaryUseCase.execute(id);
            res.status(HttpStatus.NO_CONTENT).send(); // 204 No Content for successful deletion
        } catch (error: any) {
            console.error("Error deleting beneficiary:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete beneficiary', error: error.message });
        }
    }
}