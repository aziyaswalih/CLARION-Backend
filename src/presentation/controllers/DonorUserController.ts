import { DonorRepository } from "../../infrastructure/repositories/donors/DonorRepository";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DonorUseCases } from "../../application/usecases/donor/DonorUseCase";
import { UserUseCases } from "../../application/usecases/user/userUseCase";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { ObjectId } from "mongoose";
import { HttpStatus } from "../../constants/httpStatus";
import { StoryUseCase } from "../../application/usecases/story/StoryUseCase";

const donorRepo = new DonorRepository();
const donorUseCases = new DonorUseCases(donorRepo);

const userRepo = new UserMongoRepository();
const userUseCases = new UserUseCases(userRepo);

const storyUseCases = new StoryUseCase();

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
            console.log(profilePicUrl,'profile pic url');
            
            let updatedData = {
                ...req.body
                // ,
                // ...(profilePicUrl && { profilePic: profilePicUrl })
            };
            if(profilePicUrl){
                updatedData = {...updatedData,profilePic:profilePicUrl}
            }
            console.log(updatedData,'updated data');
            
            const updatedDonor = await donorUseCases.updateDonor(decoded.id, {address:updatedData.address});
            const updatedUser = await userUseCases.updateUser(decoded.id, updatedData);

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

    static async getDonationsByDonorId(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
            const donations = (await donorUseCases.getDonationsByDonorId(decoded.id));

            if (!donations) {
                return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "No donations found" });
            }

            res.status(HttpStatus.OK).json({ success: true, message: "Donations retrieved successfully", data: donations });
        } catch (error: any) {
            console.error("Error fetching donations:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch donations", error: error.message });
        }
    }

    // static async addBloodDonation(req: Request, res: Response) {
    //     try {
    //         const token = req.headers.authorization?.split(" ")[1];
    //         if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Access token is missing" });
    //         const causeId = req.body.causeId;
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    //         const bloodDonation = await donorUseCases.addBloodDonation({ storyId:causeId, donorId: decoded.id });
    //         const updateStory = await storyUseCases.updateStatus({id:causeId,status:'completed'});
    //         if (!bloodDonation) {
    //             return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Failed to add blood donation" });
    //         }
    //         if (!updateStory) {
    //             return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Failed to update story status" }); 
    //         }
    //         res.status(201).json({ success: true, message: "Blood donation added successfully", data: bloodDonation });
    //         return;
    //     } catch (error: any) {
    //         console.error("Error adding blood donation:", error);
    //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to add blood donation", error: error.message });
    //     }
    // }
    static async addBloodDonation(req: Request, res: Response) {
        try {
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
              .status(HttpStatus.UNAUTHORIZED)
              .json({ message: "Access token is missing or invalid" });
          }
      
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
      
          const { causeId } = req.body;
          if (!causeId) {
            return res
              .status(HttpStatus.BAD_REQUEST)
              .json({ success: false, message: "Cause ID is required" });
          }
      
          const bloodDonation = await donorUseCases.addBloodDonation({
            storyId: causeId,
            donorId: decoded.id,
          });

          console.log(bloodDonation,'blood donation');
          
      
          if (!bloodDonation) {
            return res
              .status(HttpStatus.NOT_FOUND)
              .json({ success: false, message: "Failed to add blood donation" });
          }
      
          const updateStory = await storyUseCases.updateStatus({
            id: causeId,
            status: "completed",
          });

          console.log(updateStory,'update story');
      
          if (!updateStory) {
            return res
              .status(HttpStatus.NOT_FOUND)
              .json({ success: false, message: "Failed to update story status" });
          }
      
          return res.status(HttpStatus.CREATED).json({
            success: true,
            message: "Blood donation added successfully",
            data: bloodDonation,
          });
        } catch (error: any) {
          console.error("Error adding blood donation:", error);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to add blood donation",
            error: error.message,
          });
        }
      }
      
}
