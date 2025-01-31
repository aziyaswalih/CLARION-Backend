import { Request, Response } from "express";
// import { BeneficiaryModel } from "../../infrastructure/database/models/BeneficiaryModel";
import { UserModel } from "../../infrastructure/database/models/UserModel";
import bcrypt from 'bcrypt';
import { UserEntity } from "../../domain/entities/UserEntity";

export class BeneficiaryController {
  

  // async addBeneficiary(req: Request, res: Response): Promise<void>{
  //   try {
  //     const { name, email, phone, role } = req.body;
  
  //     // Check if the required fields are provided
  //     if (!name || !email || !phone || !role) {
  //       return res.status(400).json({ success: false, message: 'All fields are required.' });
  //     }
  
  //     // Check if the email already exists
  //     const existingUser = await UserModel.findOne({ email });
  //     if (existingUser) {
  //       return res.status(400).json({ success: false, message: 'Email is already in use.' });
  //     }
  
  //     // Default password
  //     const defaultPassword = 'abcd1234';
  //     const hashedPassword = await bcrypt.hash(defaultPassword, 10); // Hash the password for security
  //     req.body.password =defaultPassword
  //     // Create a new beneficiary
  //     console.log('execute avunillaa');
      
  //     // const user = await this.registerUseCase.execute(req.body);

  //     // Save the beneficiary to the database
  //     // await newBeneficiary.save();
  
  //     res.status(201).json({ success: true, message: 'Beneficiary added successfully.' });
  //   } catch (error) {
  //     console.error('Error adding beneficiary:', error);
  //     res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  //   }
  // };

  async getAllBeneficiaries(req: Request, res: Response): Promise<void> {
    try {
      const beneficiaries = await UserModel.find({role:'user'});
      console.log(beneficiaries);
      
      res.status(200).json({ success: true, beneficiaries });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Edit Beneficiary
  async editBeneficiary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const beneficiary = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
      if (!beneficiary) {
         res.status(404).json({ success: false, message: 'Beneficiary not found' });
      }

      res.status(200).json({ success: true, beneficiary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Block Beneficiary
  async blockBeneficiary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const beneficiary = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!beneficiary) {
      res.status(404).json({ success: false, message: 'Beneficiary not found' });
      }

      res.status(200).json({ success: true, message: 'Beneficiary blocked successfully', beneficiary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }  // Unblock Beneficiary
  async unblockBeneficiary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const beneficiary = await UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
      if (!beneficiary) {
      res.status(404).json({ success: false, message: 'Beneficiary not found' });
      }

      res.status(200).json({ success: true, message: 'Beneficiary unblocked successfully', beneficiary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // fetch user
  async getBeneficiary(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const beneficiary = await UserModel.findById(id);
      if (!beneficiary) {
         res.status(404).json({ success: false, message: 'Beneficiary not found' });
      }
      console.log(beneficiary);
      
      res.status(200).json({ success: true, beneficiary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
