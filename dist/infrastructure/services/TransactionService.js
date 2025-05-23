"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTransactions = exports.updateTransactionStatus = exports.createTransaction = void 0;
const TransactionModel_1 = require("../database/models/TransactionModel");
const createTransaction = async (data) => {
    const transaction = new TransactionModel_1.Transaction({ ...data });
    return await transaction.save();
};
exports.createTransaction = createTransaction;
const updateTransactionStatus = async (transactionId, status) => {
    return await TransactionModel_1.Transaction.findByIdAndUpdate(transactionId, { status }, { new: true });
};
exports.updateTransactionStatus = updateTransactionStatus;
const getUserTransactions = async (userId) => {
    return await TransactionModel_1.Transaction.find({ userId }).sort({ date: -1 });
};
exports.getUserTransactions = getUserTransactions;
