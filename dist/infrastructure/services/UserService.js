"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.findUserByEmail = void 0;
const UserModel_1 = require("../database/models/UserModel");
const findUserByEmail = async (email) => {
    return await UserModel_1.UserModel.findOne({ email });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return await UserModel_1.UserModel.findById(id);
};
exports.findUserById = findUserById;
