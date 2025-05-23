import { VolunteerRepository } from "../../infrastructure/repositories/volunteers/VolunteerRepository";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { VolunteerUseCases } from "../../application/usecases/volunteer/VolunteerUseCase";
import { UserUseCases } from "../../application/usecases/user/userUseCase";
import { UserMongoRepository } from "../../infrastructure/repositories/user/UserMongoRepository";
import { HttpStatus } from "../../constants/httpStatus";

const volunteerRepo = new VolunteerRepository();
const volunteerUseCases = new VolunteerUseCases(volunteerRepo);

const userRepo = new UserMongoRepository();
const userUseCases = new UserUseCases(userRepo);

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export class VolunteerController {
  static async addVolunteer(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: "Access token is missing" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;
      const volunteer = await volunteerUseCases.addVolunteer({
        volunteerId: decoded.id,
        ...req.body,
      });

      res
        .status(HttpStatus.CREATED)
        .json({
          success: true,
          message: "Volunteer added successfully",
          data: volunteer,
        });
    } catch (error: any) {
      console.error("Error adding volunteer:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Failed to add volunteer",
          error: error.message,
        });
    }
  }

  static async getVolunteers(req: Request, res: Response) {
    try {
      const volunteers = await volunteerUseCases.getVolunteers();
      res
        .status(HttpStatus.OK)
        .json({
          success: true,
          message: "Volunteers retrieved successfully",
          data: volunteers,
        });
    } catch (error: any) {
      console.error("Error fetching volunteers:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Failed to fetch volunteers",
          error: error.message,
        });
    }
  }

  static async getVolunteerById(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Access token is missing" });

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;
      // console.log(decoded,'decoded');
      // if (decoded.error.name === 'TokenExpiredError'){
      //     return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, error: 'jwt expired' });
      // }
      const volunteer = await volunteerUseCases.getVolunteerById(decoded.id);
      if (!volunteer) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Volunteer not found" });
      }
      // console.log(volunteer,'volunteer & user from volunteerusercontroller');

      res
        .status(HttpStatus.OK)
        .json({
          success: true,
          message: "Volunteer retrieved successfully",
          data: volunteer,
        });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, error: "jwt expired" });
      }
      console.error("Error fetching volunteer:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Error fetching profile",
          error: error.message,
        });
    }
  }

  static async updateVolunteer(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Access token is missing" });

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;

      let profilePicUrl;
      if (req.file) {
        profilePicUrl = `/uploads/${req.file.filename}`;
      }

      // Merge the file path with other body fields
      const updatedData = {
        ...req.body,
        ...(profilePicUrl && { profilePic: profilePicUrl }),
      };

      const updatedVolunteer = await volunteerUseCases.updateVolunteer(
        decoded.id,
        updatedData
      );
      const updatedUser = await userUseCases.updateUser(
        decoded.id,
        updatedData
      );

      if (!updatedVolunteer || !updatedUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Volunteer not found" });
      }

      res
        .status(HttpStatus.OK)
        .json({
          success: true,
          message: "Profile updated successfully",
          data: { updatedVolunteer, updatedUser },
        });
    } catch (error: any) {
      console.error("Error updating volunteer:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Failed to update volunteer profile",
          error: error.message,
        });
    }
  }

  static async deleteVolunteer(req: Request, res: Response) {
    try {
      const deleted = await volunteerUseCases.deleteVolunteer(req.params.id);

      if (!deleted) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: "Volunteer not found" });
      }

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Volunteer deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting volunteer:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: "Failed to delete volunteer",
          error: error.message,
        });
    }
  }
}
