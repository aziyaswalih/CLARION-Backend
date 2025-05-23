import { IWallet, Wallet } from "../database/models/WalletModel";
import { Transaction } from "../database/models/TransactionModel";

export const getWalletByUserId = async (userId: string): Promise<IWallet> => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    return await Wallet.create({ userId, balance: 0 });
  }
  return wallet;
};

export const addToWallet = async (
  userId: string,
  amount: number,
  purpose: "refund" | "donating"
) => {
  const wallet = await getWalletByUserId(userId);
  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({
    userId,
    amount,
    mode: "wallet",
    walletUsed: amount,
    purpose,
    status: "success",
  });

  return wallet;
};

export const deductFromWallet = async (
  userId: string,
  amount: number,
  purpose: "donating"
): Promise<IWallet | null> => {
  const wallet = await getWalletByUserId(userId);

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance in wallet");
  }

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({
    userId,
    amount,
    mode: "wallet",
    walletUsed: amount,
    purpose,
    status: "success",
  });

  return wallet;
};
