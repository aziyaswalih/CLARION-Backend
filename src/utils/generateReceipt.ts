import crypto from "crypto";

export const generateReceipt = (): string => {
  return crypto.randomBytes(10).toString("hex");
};
