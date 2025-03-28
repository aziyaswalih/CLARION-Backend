import { DonorRepository } from "../../infrastructure/repositories/donors/DonorRepository";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DonorUseCases } from "../../application/usecases/donor/DonorUseCase";
import { UserUseCases } from "../../application/usecases/user/userUseCase";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { ObjectId } from "mongoose";
import { HttpStatus } from "../../constants/httpStatus";

const donorRepo = new DonorRepository();
const donorUseCases = new DonorUseCases(donorRepo);

const userRepo = new UserMongoRepository();
const userUseCases = new UserUseCases(userRepo);

interface CustomJwtPayload extends JwtPayload {
    id: string;
}

export class DonorController {
    static async addDonor(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Access token is missing" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
            const donor = await donorUseCases.addDonor({ donorId: decoded.id, ...req.body });

            res.status(201).json({ success: true, message: "Donor added successfully", data: donor });
        } catch (error: any) {
            console.error("Error adding donor:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to add donor", error: error.message });
        }
    }

    static async getDonors(req: Request, res: Response) {
        try {
            const donors = await donorUseCases.getDonors();
            res.status(HttpStatus.OK).json({ success: true, message: "Donors retrieved successfully", data: donors });
        } catch (error: any) {
            console.error("Error fetching donors:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch donors", error: error.message });
        }
    }

    static async getDonorById(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

            const donor = await donorUseCases.getDonorById(decoded.id);
            const user = await userUseCases.getUser(decoded.id);

            if (!donor && !user) {
                               
                    return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Donor not found" });
                           
            }else if(!donor && user){
            const donor =   donorUseCases.addDonor({donorId:decoded.id})
            res.status(HttpStatus.OK).json({ success: true, message: "Donor retrieved successfully", data: donor });

            }


            res.status(HttpStatus.OK).json({ success: true, message: "Donor retrieved successfully", data: donor });
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: 'jwt expired' });
            }
            console.error("Error fetching donor:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching profile", error: error.message });
        }
    }

    static async updateDonor(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

            let profilePicUrl;
            if (req.file) {
                console.log(req.file,'file anme');
                
                profilePicUrl = `/uploads/${req.file.filename}`;
            }

            const updatedData = {
                ...req.body
                // ,
                // ...(profilePicUrl && { profilePic: profilePicUrl })
            };
            if(profilePicUrl){
                updatedData.donorId = {...updatedData.donorId,profilePic:profilePicUrl}
            }
            console.log(updatedData,'updated data');
            
            const updatedDonor = await donorUseCases.updateDonor(decoded.id, {address:updatedData.address});
            const updatedUser = await userUseCases.updateUser(decoded.id, updatedData.donorId);

            if (!updatedDonor || !updatedUser) {
                return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Donor not found" });
            }

            res.status(HttpStatus.OK).json({ success: true, message: "Profile updated successfully", data: { updatedDonor, updatedUser } });
        } catch (error: any) {
            console.error("Error updating donor:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update donor profile", error: error.message });
        }
    }

    static async deleteDonor(req: Request, res: Response) {
        try {
            const deleted = await donorUseCases.deleteDonor(req.params.id);

            if (!deleted) {
                return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Donor not found" });
            }

            res.status(HttpStatus.OK).json({ success: true, message: "Donor deleted successfully" });
        } catch (error: any) {
            console.error("Error deleting donor:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete donor", error: error.message });
        }
    }
}
