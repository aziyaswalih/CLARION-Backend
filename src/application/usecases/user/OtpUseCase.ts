import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class OtpUseCase {
  private jwtSecret: string;

  constructor(private userRepository: IUserRepository) {
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
  async verifyOtpToken(token: string, otp: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { email: string; otp: string };
      console.log(decoded,decoded.otp,otp, 'otp usecase');
      const user= await this.userRepository.findByEmail(decoded.email)
      if(decoded.otp === otp && user){
        console.log(user, 'user from otpusecase');
        
        this.userRepository.update(user.id,{is_verified:true})
        return true;
      }else{
        return false
      }
    } catch (error) {
      throw new Error("Invalid or expired OTP.");
    }
  }
}
