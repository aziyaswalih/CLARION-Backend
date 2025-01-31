import { Request, Response } from "express";
// import { VolunteerModel } from "../../infrastructure/database/models/VolunteerModel";
import { UserModel } from "../../infrastructure/database/models/UserModel";

export class VolunteerController {

  async getAllVolunteers(req: Request, res: Response): Promise<void> {
    try {
      const volunteers = await UserModel.find({role:'volunteer'});
      console.log(volunteers);
      
      res.status(200).json({ success: true, volunteers: volunteers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Edit Volunteer
  async editVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const volunteer = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
      if (!volunteer) {
         res.status(404).json({ success: false, message: 'Volunteer not found' });
      }

      res.status(200).json({ success: true, volunteer: volunteer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Block Volunteer
  async blockVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const volunteer = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!volunteer) {
      res.status(404).json({ success: false, message: 'Volunteer not found' });
      }

      res.status(200).json({ success: true, message: 'Volunteer blocked successfully', volunteer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }  // Unblock Volunteer
  async unblockVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const volunteer = await UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
      if (!volunteer) {
      res.status(404).json({ success: false, message: 'Volunteer not found' });
      }

      res.status(200).json({ success: true, message: 'Volunteer unblocked successfully', volunteer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // fetch user
  async getVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const volunteer = await UserModel.findById(id);
      if (!volunteer) {
         res.status(404).json({ success: false, message: 'Volunteer not found' });
      }
      console.log(volunteer);
      
      res.status(200).json({ success: true, volunteer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
