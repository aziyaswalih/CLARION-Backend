import { Request, Response } from "express";
import { UserModel } from "../../infrastructure/database/models/UserModel";

export class DonorController {

  // Get all donors
  async getAllDonors(req: Request, res: Response): Promise<void> {
    try {
      const donors = await UserModel.find({ role: 'donor' });
      console.log(donors);

      res.status(200).json({ success: true, donors });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Edit Donor
  async editDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const donor = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found' });
      }

      res.status(200).json({ success: true, donor });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Block Donor
  async blockDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const donor = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found' });
      }

      res.status(200).json({ success: true, message: 'Donor blocked successfully', donor });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Unblock Donor
  async unblockDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const donor = await UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found' });
      }

      res.status(200).json({ success: true, message: 'Donor unblocked successfully', donor });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Fetch a single donor
  async getDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const donor = await UserModel.findById(id);
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found' });
      }
      console.log(donor);

      res.status(200).json({ success: true, donor });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
