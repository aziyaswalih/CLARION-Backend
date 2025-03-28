// import { VolunteerRepository } from "../../infrastructure/repositories/volunteers/VolunteerRepository";
// import { Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { VolunteerUseCases } from "../../../application/usecases/volunteer/VolunteerUseCase";

// const volunteerRepo = new VolunteerRepository();
// const volunteerUseCases = new VolunteerUseCases(volunteerRepo);

// interface CustomJwtPayload extends JwtPayload {
//     id: string;
// }

// export class VolunteerController {
//     static async addVolunteer(req: Request, res: Response) {
//         try {
//             const token = req.headers.authorization?.split(" ")[1];
//             if (!token) {
//                 return res.status(401).json({ success: false, message: "Access token is missing" });
//             }

//             const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
//             const volunteer = await volunteerUseCases.addVolunteer({ volunteerId: decoded.id, ...req.body });

//             res.status(201).json({ success: true, message: "Volunteer added successfully", data: volunteer });
//         } catch (error) {
//             console.error("Error adding volunteer:", error);
//             res.status(500).json({ success: false, message: "Failed to add volunteer", error: error.message });
//         }
//     }

//     static async getVolunteers(req: Request, res: Response) {
//         try {
//             const volunteers = await volunteerUseCases.getVolunteers();
//             res.status(200).json({ success: true, message: "Volunteers retrieved successfully", data: volunteers });
//         } catch (error) {
//             console.error("Error fetching volunteers:", error);
//             res.status(500).json({ success: false, message: "Failed to fetch volunteers", error: error.message });
//         }
//     }

//     static async getVolunteerById(req: Request, res: Response) {
//         try {
//             const volunteer = await volunteerUseCases.getVolunteerById(req.params.id);

//             if (!volunteer) {
//                 return res.status(404).json({ success: false, message: "Volunteer not found" });
//             }

//             res.status(200).json({ success: true, message: "Volunteer retrieved successfully", data: volunteer });
//         } catch (error) {
//             console.error("Error fetching volunteer:", error);
//             res.status(500).json({ success: false, message: "Failed to fetch volunteer", error: error.message });
//         }
//     }

//     static async updateVolunteer(req: Request, res: Response) {
//         try {
//             const updatedVolunteer = await volunteerUseCases.updateVolunteer(req.params.id, req.body);

//             if (!updatedVolunteer) {
//                 return res.status(404).json({ success: false, message: "Volunteer not found" });
//             }

//             res.status(200).json({ success: true, message: "Volunteer updated successfully", data: updatedVolunteer });
//         } catch (error) {
//             console.error("Error updating volunteer:", error);
//             res.status(500).json({ success: false, message: "Failed to update volunteer", error: error.message });
//         }
//     }

//     static async deleteVolunteer(req: Request, res: Response) {
//         try {
//             const deleted = await volunteerUseCases.deleteVolunteer(req.params.id);

//             if (!deleted) {
//                 return res.status(404).json({ success: false, message: "Volunteer not found" });
//             }

//             res.status(200).json({ success: true, message: "Volunteer deleted successfully" });
//         } catch (error) {
//             console.error("Error deleting volunteer:", error);
//             res.status(500).json({ success: false, message: "Failed to delete volunteer", error: error.message });
//         }
//     }
// }


import { IVolunteerRepository } from "../../../domain/interfaces/IVolunteerRepository";
import { Volunteer } from "../../../domain/entities/VolunteerEntity";

export class VolunteerUseCases {
    constructor(private volunteerRepo: IVolunteerRepository) {}

    async addVolunteer(volunteerData: Volunteer): Promise<Volunteer> {
        return await this.volunteerRepo.addVolunteer(volunteerData);
    }

    async getVolunteers(): Promise<Volunteer[]> {
        return await this.volunteerRepo.getVolunteers();
    }

    async getVolunteerById(id: string): Promise<Volunteer | null> {
        return await this.volunteerRepo.getVolunteerById(id);
    }

    async updateVolunteer(id: string, updateData: Partial<Volunteer>): Promise<Volunteer | null> {
        return await this.volunteerRepo.updateVolunteer(id, updateData);
    }

    async deleteVolunteer(id: string): Promise<boolean> {
        return await this.volunteerRepo.deleteVolunteer(id);
    }
}
