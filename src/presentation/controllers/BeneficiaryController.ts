import { Request, Response } from "express";
import { BeneficiaryModel } from "../../infrastructure/database/models/BeneficiaryModel";

export class BeneficiaryController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const beneficiary = await BeneficiaryModel.create(req.body);
      res.status(201).json({ success: true, beneficiary });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllBeneficiaries(req: Request, res: Response): Promise<void> {
    try {
      const beneficiaries = await BeneficiaryModel.find();
      res.status(200).json({ success: true, beneficiaries });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
