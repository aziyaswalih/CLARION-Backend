import { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "../../application/usecases/user/LoginUserUseCase";
import { RegisterUserUseCase } from "../../application/usecases/user/RegisterUserUseCase";
import { OtpUseCase } from "../../application/usecases/user/OtpUseCase";
import { EmailService } from "../../infrastructure/services/EmailService";
import { ResetPasswordUseCase } from "../../application/usecases/user/ResetUserUseCase";
import { User_Google_Auth_useCase } from "../../infrastructure/services/AuthService";
import jwt from "jsonwebtoken";


export class UserController {
  constructor(
    private loginUseCase: LoginUserUseCase,
    private registerUseCase: RegisterUserUseCase,
    private otpUseCase: OtpUseCase,
    private emailService: EmailService,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private AuthService: User_Google_Auth_useCase,
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

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      await this.resetPasswordUseCase.execute(email, password);
      res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error:any) {
      res.status(400).json({ success: false, message: error.message || "Error resetting password" });
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
      const isValid = await this.otpUseCase.verifyOtpToken(token, otp);

      if (!isValid) {
        throw new Error("Invalid OTP.");
      }

      res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: "catch from verify otp" });
    }
  }
  
async User_Google_Auth(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("google Signin");

    const { credential } = req.body;
    console.log(credential);

    const user = await this.AuthService.execute(credential);
    // const refresh_token = GenerateRefreshToken(user.id, user.role);
    // const access_token = GenerateAccessToken(user.id, user.role);

    const { password, ...without } = user;

    // console.log("tokenssss    " + access_token, refresh_token);
    const token = jwt.sign({ id: user.id, role: user.role,name:user.name }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res
      // .cookie("user_refreshToken", refresh_token, {
      //   httpOnly: true,
      // })
      .status(200)
      .json({ message: "login success", user: without, token });
  } catch (error: any) {
    console.log("error -> usercntrol - > googleSignin", error.message);
    next(error);
  }
}
}



