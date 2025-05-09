import { Request, Response } from "express";
import { LoginAdminUseCase } from "../../../application/usecases/admin/LoginAdminUseCase";
import { HttpStatus } from "../../../constants/httpStatus";
import  Story  from "../../../infrastructure/database/models/StoryModel";
export class AdminController {
  constructor(
    private loginUseCase: LoginAdminUseCase,
  ) {}

  // Login admin
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Execute login use case
      const result = await this.loginUseCase.execute(email, password);
      // console.log(result.user);
      
      res.status(HttpStatus.OK).json({ success: true, token:result.token,user:result.user });
    } catch (error: any) {
      res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: error.message });
    }
  }

//   // export const getDonationReport = async () => {
//   async getDonationReport(req: Request, res: Response) {
//     console.log("Fetching donation report...");
//     try {
    
//     const results = await Story.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$amount" },
//           totalRaised: { $sum: "$raisedAmount" },
//           totalCompleted: {
//             $sum: {
//               $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalAmount: 1,
//           totalRaised: 1,
//           totalRemaining: { $subtract: ["$totalAmount", "$totalRaised"] },
//           totalCompleted: 1,
//         },
//       },
//     ]);
  
//     return results[0] || {
//       totalAmount: 0,
//       totalRaised: 0,
//       totalRemaining: 0,
//       totalCompleted: 0,
//     };
//   } catch (error) {
//     console.error("Error fetching donation report:", error);
//     throw new Error("Failed to fetch donation report");
//   }

// }
// GET donation report
async getDonationReport(req: Request, res: Response) {
  console.log("Fetching donation report...");
  try {
    const results = await Story.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalRaised: { $sum: "$raisedAmount" },
          totalCompleted: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalRaised: 1,
          totalRemaining: { $subtract: ["$totalAmount", "$totalRaised"] },
          totalCompleted: 1,
        },
      },
    ]);

    const report = results[0] || {
      totalAmount: 0,
      totalRaised: 0,
      totalRemaining: 0,
      totalCompleted: 0,
    };

    res.status(HttpStatus.OK).json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching donation report:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch donation report",
    });
  }
}

}