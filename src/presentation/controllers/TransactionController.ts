import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserTransactions } from '../../infrastructure/services/TransactionService';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decodedToken as jwt.JwtPayload).id;
    const transactions = await getUserTransactions(userId);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};
