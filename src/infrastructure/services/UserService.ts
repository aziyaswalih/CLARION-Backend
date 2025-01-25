import { UserModel } from "../database/models/UserModel";

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};
