import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserMongoRepository } from "../infrastructure/repositories/user/UserMongoRepository";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
const userRepository:IUserRepository = new UserMongoRepository();

// Define a custom interface to extend JwtPayload and include 'role'
interface CustomJwtPayload extends JwtPayload {
  role: "user" | "donor" | "volunteer"| "admin";
}
type AllowedRoles = "user" | "donor" | "volunteer" | "admin";


export const authMiddleware =  (allowedRoles: AllowedRoles[] ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        allowedRoles.push("admin") // add admin role to the allowed roles
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload
            // req.user = decoded;

            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: Access denied for your role" });
            }
            const user = await userRepository.findById(decoded.id)
            if(user && !user?.isActive){
                res.clearCookie("refreshToken", { httpOnly: true, sameSite: 'strict' });
                return res.status(403).json({ message: "Forbidden: You are blocked" });

            }

            next();
        } catch (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    };
};


