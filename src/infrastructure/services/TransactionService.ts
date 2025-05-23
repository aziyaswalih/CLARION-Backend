import mongoose from 'mongoose';
import { ITransaction, Transaction } from '../database/models/TransactionModel';

interface CreateTransactionDTO {
  userId: mongoose.Types.ObjectId;
  amount: number;
  mode: 'wallet' | 'razorpay' | 'wallet+razorpay';
  walletUsed: number;
  razorpayUsed: number;
  purpose: string;
  razorpayPaymentId?: string;
}

export const createTransaction = async (data: CreateTransactionDTO): Promise<ITransaction> => {
  const transaction = new Transaction({ ...data });
  return await transaction.save();
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: 'pending' | 'success' | 'failed' | 'refunded'
): Promise<ITransaction | null> => {
  return await Transaction.findByIdAndUpdate(transactionId, { status }, { new: true });
};

export const getUserTransactions = async (userId: string): Promise<ITransaction[]> => {
  return await Transaction.find({ userId }).sort({ date: -1 });
};
