import { UserModel } from "../database/models/UserModel";

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await UserModel.findById(id);
};
