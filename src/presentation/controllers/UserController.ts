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
    private AuthService: User_Google_Auth_useCase
  ) {}

  // Register User and Send OTP
  async register(req: Request, res: Response) {
    try {
      // Execute registration use case
      console.log(req.body);

      const { name, email, password, phone, role } = req.body;
      if (!name || !email || !password || !phone || !role)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: "Missing field" });
      const user = await this.registerUseCase.execute(req.body);
      console.log(user.password);

      // Generate OTP as a JWT token
      const otp = this.otpUseCase.generateOtpToken(user.email);
      console.log(otp, user.email, "usercontroller email and otp");

      // Send OTP via email
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        text: `Your OTP is: ${otp[0]}`,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        user,
        message: "Registration successful. OTP sent to your email.",
        token: otp[1],
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
      console.log(error);
    }
  }

  // Login User
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Execute login use case
      const result = await this.loginUseCase.execute(email, password);
      if (!result) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ success: false, message: "User blocked" });
      }
      console.log(result.user);
      res.cookie("refreshToken", result.refresh_token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res
        .status(HttpStatus.OK)
        .json({ success: true, token: result.token, user: result.user });
    } catch (error: any) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: error.message });
    }
  }

  // Logout User
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      await this.resetPasswordUseCase.execute(email, password);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "Error resetting password",
      });
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
      console.log(otp, email, "usercontroller email and otp");

      // Send OTP via email
      await this.emailService.sendEmail({
        to: email,
        subject: "Resend OTP",
        text: `Your OTP is: ${otp[0]}`,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP sent successfully.",
        otpToken: otp, // For debugging purposes; remove in production
      });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  // Verify OTP
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { token, otp } = req.body;

      if (!token || !otp) {
        throw new Error("Token and OTP are required.");
      }
      console.log(token, otp, "usercontroler verify otp");

      // Verify the OTP using the OTP use case
      const isValid = await this.otpUseCase.verifyOtpToken(token, otp);

      if (!isValid) {
        throw new Error("Invalid OTP.");
      }

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "OTP verified successfully." });
    } catch (error: any) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "catch from verify otp" });
    }
  }

  // Google Auth Login
  async User_Google_Auth(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Google Signin");

      const { credential } = req.body;
      console.log(credential);

      const user = await this.AuthService.execute(credential);
      const { password, ...without } = user;

      // Generate tokens (make sure you have a refresh token strategy here)
      const access_token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "1D" }
      );
      // refresh token no implemented
      const refresh_token = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "7D" }
      );

      // Set refresh token in httpOnly cookie
      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send access token and user data in response
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Login success",
        token: access_token,
        user: without,
      });
    } catch (error: any) {
      console.log("error -> usercontrol -> googleSignin", error.message);
      next(error);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "User ID is required" });
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Token is required" });
      const user = await findUserById(id);
      if (!user)
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User not found" });

      res
        .status(HttpStatus.OK)
        .json({ message: "User retrieved successfully", user });
    } catch (error: any) {
      console.log("error -> usercontrol -> getUser", error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving user" });
    }
  }

  //   async User_Google_Auth(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       console.log("google Signin");

  //       const { credential } = req.body;
  //       console.log(credential);

  //       const user = await this.AuthService.execute(credential);
  //       // const refresh_token = GenerateRefreshToken(user.id, user.role);
  //       // const access_token = GenerateAccessToken(user.id, user.role);

  //       const { password, ...without } = user;

  //       // console.log("tokenssss    " + access_token, refresh_token);
  //       const token = jwt.sign(
  //         { id: user.id, role: user.role, name: user.name },
  //         process.env.JWT_SECRET!,
  //         { expiresIn: "1h" }
  //       );

  //       res
  //         // .cookie("user_refreshToken", refresh_token, {
  //         //   httpOnly: true,
  //         // })
  //         .status(HttpStatus.OK)
  //         .json({ message: "login success", user: without, token });
  //     } catch (error: any) {
  //       console.log("error -> usercontrol - > googleSignin", error.message);
  //       next(error);
  //     }
  //   }
}

interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
  role: string;
  name: string;
}
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { HttpStatus } from "../../constants/httpStatus";
import { findUserById } from "../../infrastructure/services/UserService";
const userRepository: IUserRepository = new UserMongoRepository();

export const refreshTokenController = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  console.log(req.cookies, "cookies from refresh token route");

  if (!token) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Refresh token missing" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;
    console.log(payload, "payload from refresh token end point");

    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role, name: payload.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    console.log("refresh token working");
    const user = await userRepository.findById(payload.id);
    if (user && !user?.isActive) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Forbidden: You are blocked" });
    }
    return res.status(HttpStatus.OK).json({ token: newAccessToken });
  } catch (error) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .json({ message: "Invalid refresh token" });
  }
};
