import { Request, Response } from "express";
// import { VolunteerModel } from "../../infrastructure/database/models/VolunteerModel";
import { UserModel } from "../../../infrastructure/database/models/UserModel";
import { HttpStatus } from "../../../constants/httpStatus";

export class VolunteerController {

  async getAllVolunteers(req: Request, res: Response): Promise<void> {
    try {
      const volunteers = await UserModel.find({role:'volunteer'});
      // console.log(volunteers);
      
      res.status(HttpStatus.OK).json({ success: true, volunteers: volunteers });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  // Edit Volunteer
  async editVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const volunteer = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
      if (!volunteer) {
         res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
      }

      res.status(HttpStatus.OK).json({ success: true, volunteer: volunteer });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }


//   // Update Volunteer

//   async updateVolunteerController(req: Request, res: Response) {
//     const { id } = req.params;
//     const updateData = req.body;

//     try {
//         const result = await updateVolunteerProfile(id, updateData);
//         if (!result) {
//             return res.status(HttpStatus.NOT_FOUND).json({ message: 'Volunteer not found' });
//         }
//         return res.status(HttpStatus.OK).json({ message: 'Volunteer profile updated', data: result });
//     } catch (error:any) {
//         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', error: error.message });
//     }
// };

  // Block Volunteer
  async blockVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const volunteer = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!volunteer) {
      res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
      }

      res.status(HttpStatus.OK).json({ success: true, message: 'Volunteer blocked successfully', volunteer });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }  // Unblock Volunteer
  async unblockVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const volunteer = await UserModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
      if (!volunteer) {
      res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
      }

      res.status(HttpStatus.OK).json({ success: true, message: 'Volunteer unblocked successfully', volunteer });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  // fetch user
  async getVolunteer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const volunteer = await UserModel.findById(id);
      if (!volunteer) {
         res.status(HttpStatus.NOT_FOUND).json({ success: false, message: 'Volunteer not found' });
      }
      // console.log(volunteer);
      
      res.status(HttpStatus.OK).json({ success: true, volunteer });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
}
