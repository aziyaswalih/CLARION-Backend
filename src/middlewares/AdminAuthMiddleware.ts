// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";

// export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.headers.authorization?.split(" ")[1];
//   // console.log(token,'token from authmiddleware');
//   interface CustomJwtPayload extends JwtPayload {
//     role: string; // Define 'role' as part of the payload
//   }
//   if (!token) {
//     res.status(401).json({ success: false, message: "Access token is missing" });
//     return;
//   }

//   try {
//     console.log("reached try at auth middleware");
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     (req as any).user = decoded; // Attach user info to the request object
//     console.log(decoded,'decoded');
//     if(decoded?.role as string)
//     next();
//   } catch (error) {
//     res.status(403).json({ success: false, message: "Invalid or expired token" });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define a custom interface to extend JwtPayload and include 'role'
interface CustomJwtPayload extends JwtPayload {
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Access token is missing" });
    return;
  }

  try {
    console.log("Reached try block in auth middleware");

    // Verify the token and assert its type
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

    // Attach user info to the request object
    (req as Request & { user?: CustomJwtPayload }).user = decoded;

    console.log(decoded, "Decoded token");

    if (decoded.role==='admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
