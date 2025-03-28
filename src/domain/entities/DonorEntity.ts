import { ObjectId } from "mongoose";
import { IUser } from "../../infrastructure/database/models/UserModel";

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Donor{
    donorId: ObjectId | IUser | string; // Reference to the user (donor)
    address?: Address
}