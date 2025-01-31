import jwt from "jsonwebtoken";

export class OtpUseCase {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "your_secret_key";
  }

  // Generate an OTP JWT
  generateOtpToken(email: string): [string,string] {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresIn = "10m"; // OTP expires in 10 minutes

    const token = jwt.sign({ email, otp }, this.jwtSecret, { expiresIn });
    console.log(`OTP for ${email}: ${otp}`); // Log the OTP for testing
    return [otp,token];
  }

  // Verify an OTP JWT
  verifyOtpToken(token: string, otp: string): boolean {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { email: string; otp: string };
      return decoded.otp === otp;
    } catch (error) {
      throw new Error("Invalid or expired OTP.");
    }
  }
}
