import { Request, Response } from "express";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
import { OtpUseCase } from "../../application/usecases/user/OtpUseCase";
import { EmailService } from "../../infrastructure/services/EmailService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import bcrypt from "bcrypt";

export class UserController {
  constructor(
    private loginUseCase: LoginUserUseCase,
    private registerUseCase: RegisterUserUseCase,
    private otpUseCase: OtpUseCase,
    private emailService: EmailService,
    private userRepository: IUserRepository
  ) {}

  // Register User and Send OTP
  async register(req: Request, res: Response) {
    try {
      // Execute registration use case
      console.log(req.body);
      
      const{name,email,password,phone,role}=req.body
      if(!name||!email||!password||!phone||!role)return res.status(401).json({error:"Missing field"})
      const user = await this.registerUseCase.execute(req.body);
      console.log(user.password);
      
      // Generate OTP as a JWT token
      const otp= this.otpUseCase.generateOtpToken(user.email);
      console.log(otp,user.email,"usercontroller email and otp");


      // Send OTP via email
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        text: `Your OTP is: ${otp[0]}`,
      });

      res.status(201).json({
        success: true,
        user,
        message: "Registration successful. OTP sent to your email.",
        token:otp[1]
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
      console.log(error)
    }
  }

  // Login User
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Execute login use case
      const result = await this.loginUseCase.execute(email, password);
      console.log(result.user);
      
      res.status(200).json({ success: true, token:result.token,user:result.user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  async resetpassword (req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(email,password);
      
      // Validate request
      if (!email  || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      // Find user by email
      const user = await this.userRepository.findByEmail(email as string);
      // need to make some changes here reset password implementing only 
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password in database and clear OTP
      // user.password = hashedPassword;
      const updated = await this.userRepository.update(user.id,{password:hashedPassword});
      
      res.status(200).json({ success: true, message: "Password reset successfully" });
  
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Resend OTP
  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Error("Email is required.");
      }

      // Generate OTP as a JWT token
      const otp = this.otpUseCase.generateOtpToken(email);
      console.log(otp,email,"usercontroller email and otp");
      
      // Send OTP via email
      await this.emailService.sendEmail({
        to: email,
        subject: "Resend OTP",
        text: `Your OTP is: ${otp[0]}`,
      });

      res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
        otpToken: otp, // For debugging purposes; remove in production
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Verify OTP
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { token, otp } = req.body;

      if (!token || !otp) {
        throw new Error("Token and OTP are required.");
      }
      console.log(token,otp,'usercontroler verify otp');
      
      // Verify the OTP using the OTP use case
      const isValid = this.otpUseCase.verifyOtpToken(token, otp);

      if (!isValid) {
        throw new Error("Invalid OTP.");
      }

      res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: "catch from verify otp" });
    }
  }
}
