import { Request, Response } from 'express';
import * as walletService from '../../infrastructure/services/WalletService';
import jwt from 'jsonwebtoken';
import BloodRequest from '../../infrastructure/database/models/BloodRequestModel'; // Adjust the path as needed
export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decodedToken as jwt.JwtPayload).id;    const wallet = await walletService.getWalletByUserId(userId);
    res.status(200).json(wallet);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

export const addWalletBalance = async (userId:string,amount:number,purpose:"refund" | "donating") => {
  try {
    const wallet = await walletService.addToWallet(userId, amount, purpose);
    return wallet;
  } catch (err:any) {
    console.log('Error adding wallet balance:', err.message);
    
  }
};

export const donateWithWallet = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decodedToken as jwt.JwtPayload).id; 
    const { amount } = req.body;
    const wallet = await walletService.deductFromWallet(userId, amount, 'donating');
    res.status(200).json(wallet);
  } catch (err:any) {
    res.status(400).json({ message: err.message });
  }
};

export const donateBlood = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decodedToken as jwt.JwtPayload).id;

    const { location, donorId, requestId } = req.body;

    if (!location || !donorId || !requestId) {
      return res.status(400).json({ message: "Location, donorId, and requestId are required." });
    }

    // Find and update the blood request
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      requestId,
      {
        status: "completed", 
        donor: donorId,
        donatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    res.status(200).json({
      message: "Donation confirmed and request marked as completed",
      data: updatedRequest,
    });

  } catch (err: any) {
    console.error("Error in donateBlood:", err);
    res.status(500).json({ message: err.message });
  }
};