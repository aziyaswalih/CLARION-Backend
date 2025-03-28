import { Request, Response } from "express";
import { UserModel } from "../../../infrastructure/database/models/UserModel";
import { redisClient } from "../../../app";
import { HttpStatus } from "../../../constants/httpStatus";

export class DonorController {

  // Get all donors
  async getAllDonors(req: Request, res: Response): Promise<void> {
    try {
      const donors = await UserModel.find({ role: 'donor' });
      // console.log(donors);

      res.status(HttpStatus.OK).json({ success: true, donors });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  // Edit Donor
  async editDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const donor = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
      if (!donor) {
         res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
      }

      res.status(HttpStatus.OK).json({ success: true, donor });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  async blockDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const donor = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!donor) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
        return;
      }
  
      // Save block status in Redis
      await redisClient.set(`blocked:${id}`, 'true');
  
      res.status(HttpStatus.OK).json({ success: true, message: 'Donor blocked successfully', donor });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
  

  async unblockDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const donor = await UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
      if (!donor) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
        return;
      }
  
      // Remove block status from Redis
      await redisClient.del(`blocked:${id}`);
  
      res.status(HttpStatus.OK).json({ success: true, message: 'Donor unblocked successfully', donor });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
  

  // Fetch a single donor
  async getDonor(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const donor = await UserModel.findById(id);
      if (!donor) {
         res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Donor not found' });
      }
      // console.log(donor);

      res.status(HttpStatus.OK).json({ success: true, donor });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
}
