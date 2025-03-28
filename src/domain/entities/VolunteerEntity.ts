import { ObjectId } from "mongoose";
import { IUser } from "../../infrastructure/database/models/UserModel";

export interface Volunteer {
    volunteerId: ObjectId | IUser;
    skills?: string[];
    motivation?: string;
    availability: "part-time" | "full-time";
    createdAt?: Date;
    updatedAt?: Date;
}
