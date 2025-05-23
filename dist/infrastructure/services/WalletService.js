"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deductFromWallet = exports.addToWallet = exports.getWalletByUserId = void 0;
const WalletModel_1 = require("../database/models/WalletModel");
const TransactionModel_1 = require("../database/models/TransactionModel");
const getWalletByUserId = async (userId) => {
    const wallet = await WalletModel_1.Wallet.findOne({ userId });
    if (!wallet) {
        return await WalletModel_1.Wallet.create({ userId, balance: 0 });
    }
    return wallet;
};
exports.getWalletByUserId = getWalletByUserId;
const addToWallet = async (userId, amount, purpose) => {
    const wallet = await (0, exports.getWalletByUserId)(userId);
    wallet.balance += amount;
    await wallet.save();
    await TransactionModel_1.Transaction.create({
        userId,
        amount,
        mode: "wallet",
        walletUsed: amount,
        purpose,
        status: "success",
    });
    return wallet;
};
exports.addToWallet = addToWallet;
const deductFromWallet = async (userId, amount, purpose) => {
    const wallet = await (0, exports.getWalletByUserId)(userId);
    if (wallet.balance < amount) {
        throw new Error("Insufficient balance in wallet");
    }
    wallet.balance -= amount;
    await wallet.save();
    await TransactionModel_1.Transaction.create({
        userId,
        amount,
        mode: "wallet",
        walletUsed: amount,
        purpose,
        status: "success",
    });
    return wallet;
};
exports.deductFromWallet = deductFromWallet;
