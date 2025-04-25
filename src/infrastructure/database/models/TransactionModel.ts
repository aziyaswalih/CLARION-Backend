// src/models/transaction.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  mode: 'wallet' | 'razorpay' | 'wallet+razorpay';
  walletUsed: number;
  razorpayUsed: number;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  purpose: string;
  razorpayPaymentId?: string;
  date: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ['wallet', 'razorpay', 'wallet+razorpay'], required: true },
  walletUsed: { type: Number, default: 0 },
  razorpayUsed: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  purpose: { type: String, required: true },
  razorpayPaymentId: { type: String },
  date: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
